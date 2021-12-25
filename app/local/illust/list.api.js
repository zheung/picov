import AS from 'assert';

import Moment from '../../../lib/Moment.js';

import { C, DB } from '../../../lib/global.js';
import assignThumbURL from '../../pixiv/illust/list/utility/assignThumbURL.lib.js';


const method = 'get';
const handle = async raw => {
	const profile = C.profile[raw.who];
	AS(profile, `未找到~[档案]~{${raw.who}}`);


	let { 'iids[]': iids } = raw;
	AS(iids, `无效~[作品IID]~{${raw['iids[]']}}`);
	if(!(iids instanceof Array)) { iids = [iids]; }


	const db = await DB.pick();
	try {
		const illusts = await db.query(
			'SELECT I."id", I."title", I."user", I."tags", I."timeUpload", I."type", I."count", U."nameLatest" FROM "pixiv"."illust" I LEFT JOIN (SELECT DISTINCT "id", FIRST_VALUE ("name") OVER (PARTITION BY "id" ORDER BY "timeCreate" ASC) AS "nameLatest" FROM "pixiv"."user") U ON I."user" = U."id" WHERE I."id" IN ($r)',
			iids
		);

		const result = illusts
			.map(illust => assignThumbURL({
				iid: illust.id,
				title: illust.title,
				uid: illust.user,
				user: illust.nameLatest,
				tags: illust.tags,
				time: Moment(illust.timeUpload).format('YY/DD/MM/HH/mm/ss'),
				type: illust.type,
				count: illust.count
			}, raw.who));

		return result;
	}
	finally { db?.close(); }

};


export { method, handle };