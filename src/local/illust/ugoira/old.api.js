import { C } from '@nuogz/pangu';

import { readdirSync } from 'fs';



export const method = 'get';
export const handle = () => {
	return readdirSync(C.dir.ugoiraSaved, 'utf8')
		.map(name => ~~name.match(/^ugoira-(\d+)\./)?.[1])
		.filter(i => i);
};
