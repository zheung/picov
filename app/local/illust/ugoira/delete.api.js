import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';


import { C } from '../../../../lib/global.js';


const method = 'post';
const handle = raw => {
	const { who, iid } = raw;

	const profile = C.profile[who];

	AS(profile, `未找到~[档案]~{${who}}`);
	AS(~~iid, `无效~[IID]~{${iid}}`);


	return Trash(resolve(C.path.dirUgoiraNew, `ugoira-${iid}.zip`));
};


export { method, handle };