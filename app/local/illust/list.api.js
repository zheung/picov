import AS from 'assert';

import { C, DB } from '../../../../lib/global.js';
import assignThumbURL from '../../../pixiv/illust/list/utility/assignThumbURL.lib.js';


const method = 'get';
const handle = async raw => {
	const profile = C.profile[raw.who];
	AS(profile, `未找到~[档案]~{${raw.who}}`);


	let { 'iids[]': iids } = raw;
	AS(iids, `无效~[作品IID]~{${raw['iids[]']}}`);
	if(!(iids instanceof Array)) { iids = [iids]; }


	const db = await DB.pick();
	try {
		const illusts = await db.query('SELECT * FROM "pixiv"."illust" WHERE id IN ($r)', [iids]);

		return illusts
			.map(illust => assignThumbURL({
				iid: illust.id,
				title: illust.title,
				uid: illust.user,
				user: illust.userName,
				tags: illust.tags,
				time: illust.url.match(/20(\d{2}\/){5}(\d{2})/g)[0],
				type: ~~illust.type,
				count: ~~illust.pageCount
			}, raw.who));

	}
	finally { db?.close(); }

};


export { method, handle };