import AS from 'assert';

import { C } from '../../../../lib/global.js';
import { getJSON } from '../../get.lib.js';
import assignThumbURL from './utility/assignThumbURL.lib.js';


const formatItem = (item, who) => assignThumbURL({
	iid: ~~item.id,
	title: item.title,
	uid: ~~item.userId,
	user: item.userName,
	tags: item.tags,
	time: item.url.match(/20(\d{2}\/){5}(\d{2})/g)?.[0],
	type: ~~item.illustType,
	count: ~~item.pageCount
}, who);


const method = 'get';
const handle = async raw => {
	const profile = C.profile[raw.who];
	AS(profile, `未找到~[档案]~{${raw.who}}`);

	const data = await getJSON(
		`https://www.pixiv.net/ajax/follow_latest/illust?p=${raw.page ?? 1}&mode=all`,
		profile.cookie
	);

	return data?.body?.thumbnails?.illust
		?.map(item => formatItem(item, raw.who))
		?? [];
};


export { method, handle };