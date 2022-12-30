import { readdirSync } from 'fs';

import { C } from '../../../../lib/global.js';


export const method = 'get';
export const handle = () => {
	return readdirSync(C.path.dirUgoiraSaved, 'utf8')
		.map(name => ~~name.match(/^ugoira-(\d+)\./)?.[1])
		.filter(i => i);
};
