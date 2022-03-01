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
	count: ~~item.pageCount
}, who);


export const optionAPI = { parseProfile: true };
export const method = 'get';
export const handle = async raw => {
	const { _profile: profile, keyword = '', page = 1, mode = 'all', smode = 's_tag_tc', type = 'all' } = raw;

	const data = await getJSON(
		`https://www.pixiv.net/ajax/search/artworks/${encodeURIComponent(keyword)}`,
		profile.cookie,
		{
			word: encodeURIComponent(keyword),
			order: 'date_d',
			mode,
			p: page,
			s_mode: smode,
			type,
		}
	);

	return {
		illusts: data?.body?.illustManga?.data
			?.map(item => formatItem(item, raw.who))
			?? [],
		total: data?.body?.illustManga?.total
	};
};
