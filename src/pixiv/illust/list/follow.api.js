import { getJSON } from '../../get.lib.js';
import assignThumbURL from './utility/assignThumbURL.lib.js';



const formatItem = item => assignThumbURL({
	iid: ~~item.id,
	title: item.title,
	uid: ~~item.userId,
	user: item.userName,
	tags: item.tags,
	time: item.url.match(/20(\d{2}\/){5}(\d{2})/g)?.[0],
	type: ~~item.illustType,
	count: ~~item.pageCount,
	typeAI: ~~item.aiType,
});


export const method = 'get';
export const parseProfile = true;
export const handle = async ({ page, $profile: profile }) => {
	const data = await getJSON(
		`https://www.pixiv.net/ajax/follow_latest/illust?p=${page ?? 1}&mode=all`,
		profile.cookie
	);

	return data?.body?.thumbnails?.illust
		?.map(item => formatItem(item))
		?? [];
};
