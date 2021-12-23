import AS from 'assert';
import { posix } from 'path';

import { C } from '../../../../lib/global.js';
import { getJSON } from '../../get.lib.js';


const method = 'get';
const handle = async raw => {
	const profile = C.profile[raw.who];
	AS(profile, `未找到~[档案]~{${raw.who}}`);

	AS(~~raw.uid, `无效~[用户UID]~{${raw.uid}}`);

	const data = await getJSON(
		`https://www.pixiv.net/ajax/user/${raw.uid}/profile/all`,
		profile.cookie
	);

	const illusts = Object.keys(data?.body?.illusts ?? []).map(id => Number(id)).sort((a, b) => b - a);
	const mangas = Object.keys(data?.body?.manga ?? []).map(id => Number(id)).sort((a, b) => b - a);
	const alls = illusts.concat(mangas).sort((a, b) => b - a);


	const data2 = await getJSON(
		`https://www.pixiv.net/ajax/user/${raw.uid}`,
		profile.cookie
	);

	const { isFollowed, name, image } = data2?.body ?? {};

	const urlHeader = new URL(image);
	const infoName = posix.parse(urlHeader.pathname);

	const header = image.includes('no_profile') ? { noProfile: true } : {
		time: urlHeader.pathname.split('/').slice(3, 9).join('/'),
		token: infoName.name.replace(/_\d+$/, ''),
		ext: infoName.ext,
	};

	return {
		illusts, mangas, alls,
		isFollowed, name,
		urlHeader: header.noProfile
			? 'no_profile.png'
			: `api/pixiv/user/header?who=${raw.who}&time=${header.time}&token=${header.token}&ext=${header.ext}`,
	};
};


export { method, handle };