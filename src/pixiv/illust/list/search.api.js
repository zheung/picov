import { getJSON } from '../../get.lib.js';
import assignThumbURL from './utility/assignThumbURL.lib.js';



const formatItem = item => assignThumbURL({
	iid: ~~item.id,
	title: item.title,
	uid: ~~item.userId,
	user: item.userName,
	tags: item.tags,
	time: item.url.match(/20(\d{2}\/){5}(\d{2})/g)[0],
	type: ~~item.illustType,
	count: ~~item.pageCount,
	typeAI: ~~item.aiType,
});


export const method = 'get';
export const parseProfile = true;
export const handle = async raw => {
	const { $profile: profile, keyword = '', page = 1, mode = 'all', modeSearch = 's_tag_tc', type: typeRaw = 'artworks' } = raw;


	const [typeIllust, type] = typeRaw.split('|');


	const data = await getJSON(
		`https://www.pixiv.net/ajax/search/${typeIllust}/${encodeURIComponent(keyword)}`,
		profile.cookie,
		{
			word: encodeURIComponent(keyword),
			order: 'date_d',
			mode,
			p: page,
			s_mode: modeSearch,
			type,
		}
	);

	const body = data?.body;
	const illusts = body?.illustManga ?? body?.illust ?? body?.manga;
	const usersBlock = profile?.block?.user;

	return {
		illusts: illusts?.data
			?.filter(item => !usersBlock?.includes(~~item.userId))
			?.map(item => formatItem(item))
			?? [],
		total: illusts?.total
	};
};
