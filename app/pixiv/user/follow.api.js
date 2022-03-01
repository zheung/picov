import AS from 'assert';

import { G } from '../../../lib/global.js';
import { postJSON } from '../get.lib.js';


export const optionAPI = { parseProfile: true };
export const method = 'post';
export const handle = async raw => {
	const { _profile: profile } = raw;


	AS(~~raw.uid, `无效~[用户UID]~{${raw.uid}}`);


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
