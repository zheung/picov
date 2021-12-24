import AS from 'assert';

import { C, G } from '../../../lib/global.js';
import { postJSON } from '../get.lib.js';


const method = 'post';
const handle = async raw => {
	const profile = C.profile[raw.who];
	AS(profile, `未找到~[档案]~{${raw.who}}`);

	AS(~~raw.uid, `无效~[用户UID]~{${raw.uid}}`);


	// const html = await getText('https://www.pixiv.net/', profile.cookie);
	// const token = html.match(/"token":"(\w+?)"/)?.[1];

	const params = new URLSearchParams();
	params.set('mode', 'add');
	params.set('type', 'user');
	params.set('user_id', raw.uid);
	params.set('restrict', 0);
	params.set('format', 'json');

	const data = await postJSON(
		`https://www.pixiv.net/bookmark_add.php`,
		profile.cookie,
		params.toString(),
		{ 'x-csrf-token': profile.token, },
	);

	G.debug('关注', `~[用户]~{${raw.uid}}`, '✔', JSON.stringify(data));
};


export { method, handle };