import AS from 'assert';

import { C } from '../../../../lib/global.js';
import { getJSON } from '../../get.lib.js';


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

	const { keyword = '', page = 1, mode = 'all', smode = 's_tag_tc', type = '' } = raw;

	const data = await getJSON(
		`https://www.pixiv.net/touch/ajax/search/illusts?p=${page}&word=${encodeURI(keyword)}&mode=${mode}&s_mode=${smode}&type=${type}`,
		profile.cookie
	);

	return data?.body?.illusts
		?.filter(item => !item.is_ad_container)
		?.map(item => formatItem(item)).filter(i => i)
		?? [];
};


export { method, handle };