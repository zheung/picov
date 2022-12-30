import { C, G } from '@nuogz/pangu';
import { DB } from '../../../lib/db.js';

import AS from 'assert';
import { createWriteStream } from 'fs';
import { parse, resolve } from 'path';

import Bluebird from 'bluebird';
import Moment from 'moment';
import { removeSync, moveSync } from 'fs-extra/esm';

import { getJSON, getStream, head } from '../get.lib.js';
import stateAdmin from './admin/StateAdmin.lib.js';



const ensureIllust = async (db, id, type) => {
	const illust = await db.queryOne('SELECT "fetch" FROM "pixiv"."illust" WHERE id=$', id);

	if(!illust) {
		await db.queryOne('INSERT INTO "pixiv"."illust"$i', { id, type });

		return 0;
	}

	return illust.fetch;
};

export const updateUserInfo = async (db, info) => {
	const userLatest = await db.queryOne('SELECT * FROM "pixiv"."user" WHERE id=$ ORDER BY "timeCreate" DESC', info.id);

	if(!userLatest
		|| userLatest.account != info.account
		|| userLatest.name != info.name
		|| userLatest.urlHeader != info.urlHeader
	) {
		G.debug('保存', '~[用户快照]', `~{${info.name}}~{${info.account}}`);
		return db.queryOne('INSERT INTO "pixiv"."user"$i', info);
	}
};

export const updateIllustInfo = (db, iid, info) => db.query('UPDATE "pixiv"."illust" SET $ WHERE id=$', info, iid);

const insertFiles = (db, files) => {
	return Bluebird.mapSeries(files, async (file, index) => {
		try {
			await db.queryOne('INSERT INTO "pixiv"."file"$i', { index, illust: file.illust, name: file.name, delay: file.delay });
		}
		catch(error) {
			if(error.code != 23505) { throw error; }
		}
	});
};

const symbols = ['B', 'K', 'M', 'G'];
const convertByte = (number, fixed = 2) => {
	const e = (Math.floor(Math.log(number) / Math.log(2))) < 1 ? 0 : (Math.floor(Math.log(number) / Math.log(2)));
	const i = Math.floor(e / 10);

	return `${(number / Math.pow(2, 10 * i)).toFixed(fixed)}${symbols[i]}`;
};

const setContentLength = (response, pid, iid, logger) => {
	const lengthContent = ~~response.headers['content-length'];

	if(lengthContent && !logger.total[pid]) {
		logger.total[pid] = lengthContent;

		G.debug('保存', `~[作品文件]~{${iid}.p${pid}}`, `~[大小]~{${lengthContent}}`);
	}
};


const fetch = async (infoFetch, pid, logger, cookie) => {
	const response = await head(infoFetch.url, cookie);
	setContentLength(response, pid, infoFetch.iid, logger);


	const fileStream = (await getStream(infoFetch.url, cookie))
		.on('response', res => {
			setContentLength(res, pid, infoFetch.iid, logger);
		})
		.on('data', chunk => {
			setContentLength(fileStream, pid, infoFetch.iid, logger);

			logger.passed[pid] ?? (logger.passed[pid] = 0);
			logger.passed[pid] += chunk.length;

			logger.calc();
		})
		.on('error', error => { throw error; });

	const nameFile = infoFetch.name ?? parse(infoFetch.url).base;
	const tempPath = resolve(C.dir.cacheLarge, nameFile);

	removeSync(tempPath);

	await new Promise((resolve, reject) =>
		fileStream.pipe(createWriteStream(tempPath)
			.on('close', () => resolve())
			.on('error', error => reject(error)))
	);

	moveSync(tempPath, resolve(infoFetch.dir, nameFile), { overwrite: true });

	logger.done();
};

const fetchMap = async (db, infosFetch, iid, cookie) => {
	const logger = {
		count: infosFetch.length,

		fetched: 0,

		total: {},
		passed: {},

		totalSum: '',

		calc() {
			let passedAll = 0;
			let sizeAll = 0;

			for(const pid in logger.passed) {
				if(logger.total[pid] > 0) {
					passedAll += logger.passed[pid];
					sizeAll += logger.total[pid];
				}
			}

			logger.totalSum = convertByte(sizeAll, 0);

			stateAdmin.push(iid, {
				progMax: sizeAll,
				prog: passedAll,
				R: Math.round(passedAll * 100 / sizeAll) + ' %',
				L: `${logger.count}张[${logger.totalSum}]`,
			});
		},
		done() {
			stateAdmin.push(iid, { fetched: ++logger.fetched });
		}
	};


	await Bluebird.map(infosFetch, async (infoFetch, idFetch) => {
		let times = 0;
		const timesMax = 5;

		while(times++ < timesMax) {
			try {
				await fetch(infoFetch, idFetch, logger, cookie);

				break;
			}
			catch(error) {
				G.error('保存', `下载~{${infoFetch.url}}`, `✖`, error);
			}
		}
	}, { concurrency: 77 });


	await updateIllustInfo(db, iid, { fetch: 1 });

	stateAdmin.push(iid, { fetch: 1, L: logger.totalSum ? `✔ [${logger.totalSum}]` : '完成' });
};


export const method = 'wock';
export const handle = async (illust, who, force) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);

	const { iid, count, type } = illust;


	G.info('保存', `~[动画]~{${iid}}`, `~[类型]~{${type}} ~[数量]~{${count}} ~[强制]~{${force}}`);


	const db = await DB.pick();
	try {
		// 预插入作品记录
		let state = await ensureIllust(db, iid, type);

		stateAdmin.push(iid, { L: '开始...', R: '' });

		// 判断下载状态
		if(force === true) { state = 0; }
		if(state == 2) { return stateAdmin.push(iid, { L: '在下' }); }
		if(state == 1) { return stateAdmin.push(iid, { L: '✔ 已下' }); }

		// 获取完整信息并更新
		stateAdmin.push(iid, { L: '解析...' });
		const info = (await getJSON(`https://www.pixiv.net/ajax/illust/${iid}`, profile.cookie))?.body ?? {};

		const timeUpload1 = info?.userIllusts?.[iid]?.updateDate;
		const timeUpload2 = info?.urls?.thumb?.match?.(/20(\d{2}\/){5}(\d{2})/g)?.[0];
		const timeUpload3 = info?.uploadDate;

		await updateIllustInfo(db, iid, {
			fetch: 2,
			title: info.illustTitle,
			user: ~~info.userId,
			type: info.illustType,
			tags: info.tags.tags.map(tag => tag.tag),
			count: info.pageCount,
			comment: info.illustComment,
			timeUpload: timeUpload1
				? Moment(timeUpload1).format()
				: timeUpload2
					? Moment(timeUpload2, 'YYYY/MM/DD/HH/mm/ss').utcOffset(420).format()
					: Moment(timeUpload3).format()
		});

		await updateUserInfo(db, {
			id: ~~info.userId,
			account: info.userAccount,
			name: info.userName,
			urlHeader: Object.values(info.userIllusts).map(i => i?.profileImageUrl).filter(i => i)[0],
			from: 'save'
		});

		stateAdmin.push(iid, { fetch: 2, L: `下载${count}张` });

		// 提取需要下载的url，并将保存文件信息
		const infosFetch = [];
		if(type == 2) {
			const meta = await getJSON(`https://www.pixiv.net/ajax/illust/${iid}/ugoira_meta`, profile.cookie);

			infosFetch.push({ iid, url: meta.body.originalSrc, dir: C.dir.ugoiraNew, name: `ugoira-${iid}.zip` });

			await insertFiles(db, meta.body.frames.map(frame => ({ illust: iid, name: frame.file, delay: frame.delay })));

			stateAdmin.push(iid, { files: meta.body.frames });
		}
		else {
			const pages = await getJSON(`https://www.pixiv.net/ajax/illust/${iid}/pages`, profile.cookie);

			pages.body.forEach(page => infosFetch.push({ iid, url: page.urls.original, dir: C.dir.illustSave }));

			await insertFiles(db, infosFetch.map(infoFetch => ({ illust: iid, name: parse(infoFetch.url).base, delay: null })));

			stateAdmin.push(iid, { files: infosFetch });
		}

		// 下载
		await fetchMap(db, infosFetch, iid, profile.cookie);
	}
	catch(error) {
		stateAdmin.push(iid, { L: '✖', R: error?.message ?? error });

		throw error;
	}
	finally { db?.close(); }
};
