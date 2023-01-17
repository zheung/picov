import { C } from '@nuogz/pangu';

import AS from 'assert';
import { readdirSync } from 'fs';



export const method = 'get';
export const handle = ({ location }) => {
	const dirUgoira = location == 'prepare'
		? C.dir.ugoiraPrepare
		: location == 'archive'
			? C.dir.ugoiraArchive
			: undefined;


	AS(dirUgoira, `无效~[位置]~{${location}}`);


	return readdirSync(dirUgoira, 'utf8')
		.map(name => ~~name.match(/^ugoira-(\d+)\./)?.[1])
		.filter(i => i);
};
