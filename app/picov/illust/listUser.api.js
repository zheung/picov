import AS from 'assert';

import { C } from '../../../lib/global.js';
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

	const { uid, type, page } = raw;

	AS(uid, `无效~[用户ID]~{${uid}}`);

	const data = await getJSON(
		`https://www.pixiv.net/touch/ajax/user/illusts?p=${page ?? 1}&id=${uid}&type=${type ?? 'all'}`,
		profile.cookie
	);

	return data?.body?.illusts?.map(item => formatItem(item)) ?? [];
};


export { method, handle };