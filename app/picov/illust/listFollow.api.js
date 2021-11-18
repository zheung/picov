import AS from 'assert';

import { C, DB } from '../../../lib/global.js';
import { getJSON } from '../get.lib.js';


const formatItem = item => {
	return {
		iid: ~~item.id,
		title: item.title,
		uid: ~~item.author_details.user_id,
		user: item.author_details.user_name,
		tags: item.tags,
		time: item.url_s.match(/20(\d{2}\/){5}(\d{2})/g)[0],
		type: ~~item.type,
		count: ~~item.page_count
	};
};


const method = 'get';
const handle = async raw => {
	const profile = C.profile[raw.who];

	AS(profile, `未找到~[档案]~{${raw.who}}`);

	const data = await getJSON(`https://www.pixiv.net/touch/ajax/follow/latest?type=illusts&p=${raw.page || 1}`, profile.cookie);

	const illustsPX = data.body.illusts.map(item => formatItem(item)) ?? [];

	const db = await DB.pick();

	let illustsDB = [];
	let files = [];

	try {
		if(illustsPX.length) {
			illustsDB = await db.query('SELECT * FROM pixiv.illust WHERE id IN ($r)', [illustsPX.map(i => i.iid)]);
			files = await db.query('SELECT * FROM pixiv.file WHERE illust IN ($r)', [illustsPX.map(i => i.iid)]);
		}

		for(const illust of illustsPX) {
			const illustSaved = illustsDB.find(i => i.id == illust.iid);

			if(illustSaved) {
				illust.down = !!(illustSaved.stat & 1);
				illust.ding = !!(illustSaved.stat & 2);

				illust.downCount = illustSaved.down ? illust.count : 0;

				illust.files = files
					.filter(file => file.illust == illustSaved.id)
					.sort((a, b) => a.index - b.index)
					.map(file => { return { delay: file.delay, file: file.name }; });
			}
			else {
				illust.downCount = 0;
			}
		}

		return illustsPX;
	}
	finally { db?.close(); }
};


export { method, handle };