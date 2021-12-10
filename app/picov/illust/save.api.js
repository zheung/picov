import AS from 'assert';

import Moment from '../../lib/Moment.js';
import { C, DB } from '../../../lib/global.js';

import { getJSON } from '../get.lib.js';
import statesIllust from './State.lib.js';


const ensureIllust = async (db, id) => {
	const illust = await db.queryOne('SELECT "fetch" FROM pixiv.illust WHERE id=$', [id]);

	if(!illust) {
		await db.queryOne('INSERT INTO pixiv.illust$i', [{ id }]);

		return 0;
	}

	return illust.fetch;
};
let updateIllust = async (conn, id, info, ding, down) => {

	await conn.query('UPDATE pixiv.illust SET $ WHERE id=$', [{
		// state: stat,
		state: 2,
		title: info.illust_details.title,
		user: ~~info.author_details.user_id,
		type: info.illust_details.type,
		tags: info.illust_details.tags,
		comment: info.illust_details.comment_html,
		timeUpload: Moment(info.illust_details.upload_timestamp, 'X').format()
	}, id]);
};

let saveFrames = async function(db, id, frames) {
	let count = 0;
	for(let frame of frames) {
		try {
			await db.queryOne('INSERT INTO pixiv.file$i', [{
				illust: id,
				index: count++,
				name: frame.file,
				delay: frame.delay
			}]);
		}
		catch(error) {
			if(~~error.code != 23505) { throw error; }
		}
	}
};
let saveUrls = async function(conn, id, urls) {
	let count = 0;

	for(let url of urls) {
		try {
			await conn.queryOne('INSERT INTO pixiv.file$i', [{
				illust: id,
				index: count++,
				name: _pa.parse(url).base
			}]);
		} catch(error) {
			if(~~error.code != 23505) {
				throw error;
			}
		}
	}
};


const method = 'wock';
const handle = async (illust, who, wock) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);

	const { iid, count, type, force } = illust;


	const db = await DB.pick();
	try {
		let state = await ensureIllust(db, iid);

		if(force) { state = 0; }
		if(state == 2) { return statesIllust.push(iid, 'statL', '在下'); }
		if(state == 1) { return statesIllust.push(iid, 'statL', '已下'); }

		statesIllust.push(iid, 'statL', '解析');
		const info = (await getJSON(`https://www.pixiv.net/touch/ajax/illust/details?illust_id=${iid}`, profile.cookie))?.body ?? {};

		await updateIllust(db, iid, info, 1);

		statesIllust.push(iid, 'ding', true);
		statesIllust.push(iid, 'statL', `下载 ${count}张`);

		let urls = [];

		if(type == 2) {
			let meta = await getJSON(`https://www.pixiv.net/ajax/illust/${iid}/ugoira_meta`, profile.cookie);

			urls.push(meta.body.originalSrc);

			await saveFrames(conn, iid, meta.body.frames);

			wock.cast('stat', iid, 'files', meta.body.frames);
		}
		else if(info.illust_details.manga_a) {
			for(let manga of info.illust_details.manga_a) {
				urls.push(manga.url_big);
			}

			await saveUrls(conn, iid, urls);

			wock.cast('stat', iid, 'files', urls);
		}
		else {
			urls.push(info.illust_details.url_big);

			await saveUrls(conn, iid, urls);

			wock.cast('stat', iid, 'files', urls);
		}

	}
	finally { db?.close(); }
};


export { method, handle };