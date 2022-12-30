import AS from 'assert';

import { getJSON } from '../../get.lib.js';
import assignThumbURL from './utility/assignThumbURL.lib.js';



const formatItem = (item, who) => assignThumbURL({
	iid: ~~item.id,
	title: item.title,
	uid: ~~item.userId,
	user: item.userName,
	tags: item.tags,
	time: item.url.match(/20(\d{2}\/){5}(\d{2})/g)[0],
	type: ~~item.illustType,
	count: ~~item.pageCount,
	typeAI: ~~item.aiType,
}, who);


export const method = 'get';
export const parseProfile = true;
export const handle = async raw => {
	let { _profile: profile, 'iids[]': ids } = raw;

	AS(ids, `无效~[作品IID]~{${raw['iids[]']}}`);

	if(!(ids instanceof Array)) { ids = [ids]; }

	const data = await getJSON(
		`https://www.pixiv.net/ajax/user/${raw.uid ?? 0}/illusts`,
		profile.cookie,
		{ ids }
	);


	return Object.values(data?.body ?? {})
		?.map(item => formatItem(item, raw.who))
		?? [];
};
