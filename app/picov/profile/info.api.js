import AS from 'assert';

import { C } from '../../../lib/global.js';


const method = 'get';
const handle = raw => {
	const profile = C.profile[raw.who];

	AS(profile, `未找到~[档案]~{${raw.who}}`);

	return profile;
};


export { method, handle };