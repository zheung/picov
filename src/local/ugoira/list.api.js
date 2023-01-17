import { C } from '@nuogz/pangu';

import AS from 'assert';
import { readdirSync } from 'fs';



export const method = 'get';
export const handle = ({ location }) => {
	const dir = location == 'new'
		? C.dir.ugoiraNew
		: location == 'saved'
			? C.dir.ugoiraSaved
			: undefined;


	AS(dir, `无效~[位置]~{${location}}`);


	return readdirSync(dir, 'utf8')
		.map(name => ~~name.match(/^ugoira-(\d+)\./)?.[1])
		.filter(i => i);
};
