import { readdirSync } from 'fs';

import { C } from '../../../../lib/global.js';


const method = 'get';
const handle = () => {
	return readdirSync(C.path.dirUgoira, 'utf8')
		.map(name => ~~name.match(/^ugoira-(\d+)\./)?.[1])
		.filter(i => i);
};


export { method, handle };