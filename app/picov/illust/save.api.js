import AS from 'assert';
import { createWriteStream } from 'fs';
import { parse, resolve } from 'path';

import Bluebird from 'bluebird';
import FX from 'fs-extra';
import ExtractZIP from 'extract-zip';

import Moment from '../../lib/Moment.js';
import { C, DB, G } from '../../../lib/global.js';

import { getJSON, getStream } from '../get.lib.js';
import statesIllust from './State.lib.js';
import { dirCacheLarge } from '../../../lib/global.dir.js';


const ensureIllust = async (db, id, type) => {
	const illust = await db.queryOne('SELECT "fetch" FROM pixiv.illust WHERE id=$', id);

	if(!illust) {
		await db.queryOne('INSERT INTO pixiv.illust$i', { id, type });

		return 0;
	}

	return illust.fetch;
};

const updateIllustInfo = (db, iid, info) => db.query('UPDATE pixiv.illust SET $ WHERE id=$', info, iid);

const insertFiles = (db, files) => {
	return Bluebird.mapSeries(files, async (file, index) => {
		try {
			await db.queryOne('INSERT INTO pixiv.file$i', { index, illust: file.illust, name: file.name, delay: file.delay });
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


const fetch = async (url, pid, logger, cookie) => {
	const fileStream = (await getStream(url, cookie))
		.on('response', res => {
			logger.total[pid] = ~~res.headers['content-length'];
		})
		.on('data', chunk => {
			if(!logger.total[pid]) {
				logger.total[pid] = ~~fileStream.headers['content-length'];
				G.debug('保存', `保存~[文件大小]`, `~{${logger.total[pid]}}`);
			}

			logger.passed[pid] ?? (logger.passed[pid] = 0);
			logger.passed[pid] += chunk.length;

			logger.calc();
		})
		.on('error', error => { throw error; });

	const nameFile = parse(url).base;
	const tempPath = resolve(dirCacheLarge, nameFile);

	FX.removeSync(tempPath);

	await new Promise((resolve, reject) =>
		fileStream.pipe(createWriteStream(tempPath)
			.on('close', () => resolve())
			.on('error', error => reject(error)))
	);

	FX.moveSync(tempPath, resolve(C.path.save, nameFile), { overwrite: true });

	logger.done();
};

const fetchMap = async (db, urls, iid, cookie) => {
	const logger = {
		count: urls.length,

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

			statesIllust.push(iid, {
				progMax: sizeAll,
				prog: passedAll,
				R: Math.round(passedAll * 100 / sizeAll) + ' %',
				L: `${logger.count}张[${logger.totalSum}]`,
			});
		},
		done() {
			statesIllust.push(iid, { fetched: ++logger.fetched });
		}
	};


	await Bluebird.map(urls, async (url, idFetch) => {
		let times = 0;
		const timesMax = 5;

		while(times++ < timesMax) {
			try {
				await fetch(url, idFetch, logger, cookie);

				break;
			}
			catch(error) {
				G.error('保存', `下载~{${url}}`, `✖`, error);
			}
		}
	}, { concurrency: 77 });


	await updateIllustInfo(db, iid, { fetch: 1 });

	statesIllust.push(iid, { fetch: 1, L: logger.totalSum ? `✔ [${logger.totalSum}]` : '完成' });
};


const method = 'wock';
const handle = async (illust, who, force) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);

	const { iid, count, type } = illust;
	(console || {}).log(iid, count, type, force);


	const db = await DB.pick();
	try {
		// 预插入作品记录
		let state = await ensureIllust(db, iid, type);

		statesIllust.push(iid, { L: '开始...', R: '' });

		// 判断下载状态
		if(force === true) { state = 0; }
		if(state == 2) { return statesIllust.push(iid, { L: '在下' }); }
		if(state == 1) { return statesIllust.push(iid, { L: '已下' }); }

		// 获取完整信息并更新
		statesIllust.push(iid, { L: '解析...' });
		const info = (await getJSON(`https://www.pixiv.net/touch/ajax/illust/details?illust_id=${iid}`, profile.cookie))?.body ?? {};

		await updateIllustInfo(db, iid, {
			fetch: 2,
			title: info.illust_details.title,
			user: ~~info.author_details.user_id,
			type: info.illust_details.type,
			tags: info.illust_details.tags,
			comment: info.illust_details.comment_html,
			timeUpload: Moment(info.illust_details.upload_timestamp, 'X').format()
		});

		statesIllust.push(iid, { fetch: 2, L: `下载${count}张` });

		// 提取需要下载的url，并将保存文件信息
		const urls = [];
		if(type == 2) {
			const meta = await getJSON(`https://www.pixiv.net/ajax/illust/${iid}/ugoira_meta`, profile.cookie);

			urls.push(meta.body.originalSrc);

			await insertFiles(db, meta.body.frames.map(frame => ({ illust: iid, name: frame.file, delay: frame.delay })));

			statesIllust.push(iid, { files: meta.body.frames });
		}
		else if(info.illust_details.manga_a) {
			for(const manga of info.illust_details.manga_a) {
				urls.push(manga.url_big);
			}

			await insertFiles(db, urls.map(url => ({ illust: iid, name: parse(url).base, delay: null })));

			statesIllust.push(iid, { files: urls });
		}
		else {
			urls.push(info.illust_details.url_big);

			await insertFiles(db, urls.map(url => ({ illust: iid, name: parse(url).base, delay: null })));

			statesIllust.push(iid, { files: urls });
		}

		// 下载
		await fetchMap(db, urls, iid, profile.cookie);


		// Ugoira额外解压
		if(type == 2) {
			try {
				const zipPath = resolve(dirCacheLarge, parse(urls[0]).base);

				await ExtractZIP(zipPath, { dir: resolve(dirCacheLarge, String(iid)) });

				FX.removeSync(zipPath);
			}
			catch(e) {
				G.error('保存', `解压~[动图]~{${iid}}`, `✖`, `${e.message}`);
			}
		}
	}
	catch(error) {
		statesIllust.push(iid, { L: '✖', R: error?.message ?? error });

		throw error;
	}
	finally { db?.close(); }
};


export { method, handle };