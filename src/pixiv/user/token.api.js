import { C } from '@nuogz/pangu';

import AS from 'assert';

import { getText } from '../get.lib.js';



export const method = 'get';
export const handle = async raw => {
	const profile = C.profile[raw.who];
	AS(profile, `未找到~[档案]~{${raw.who}}`);


	const html = await getText('https://www.pixiv.net/', profile.cookie);
	const token = html.match(/"token":"(\w+?)"/)?.[1];


	return token;
};
