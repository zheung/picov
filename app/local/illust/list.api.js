import AS from 'assert';

import Moment from 'moment';

import { C, DB } from '../../../lib/global.js';
import assignThumbURL from '../../pixiv/illust/list/utility/assignThumbURL.lib.js';

import { handle as fetchIllust } from '../../pixiv/illust/list/illust.api.js';
import { updateIllustInfo } from '../../pixiv/illust/save.api.js';


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
				time: Moment(illust.timeUpload).format('YY/MM/DD/HH/mm/ss'),
				type: illust.type,
				count: illust.count
			}, raw.who));

		const unfinishedIIDs = result.filter(illust => illust.count == 0).map(illust => illust.iid);

		if(unfinishedIIDs.length) {
			debugger
			const resultIllust = await fetchIllust(unfinishedIIDs);

			for(const illustPixiv of resultIllust) {
				await updateIllustInfo(db, illustPixiv.iid, {
					title: illustPixiv.title,
					user: illustPixiv.user,
					type: illustPixiv.type,
					tags: illustPixiv.tags,
					count: illustPixiv.count,
					timeUpload: Moment(illustPixiv.time, 'YY/MM/DD/HH/mm/ss').format(),
				});

				result.find(illust => illust.iid = illustPixiv.iid).count = illustPixiv.count;
			}
		}

		return result;
	}
	finally { db?.close(); }

};


export { method, handle };