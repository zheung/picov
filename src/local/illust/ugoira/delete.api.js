import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';


import { C } from '../../../../lib/global.js';


export const method = 'post';
export const handle = raw => {
	const { iid } = raw;

	AS(~~iid, `无效~[IID]~{${iid}}`);


	return Trash(resolve(C.path.dirUgoiraNew, `ugoira-${iid}.zip`));
};
