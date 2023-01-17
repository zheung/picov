import { C } from '@nuogz/pangu';

import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';



export const method = 'post';
export const handle = ({ iid }) => {
	AS(~~iid, `无效~[IID]~{${iid}}`);


	return Trash(resolve(C.dir.ugoiraNew, `ugoira-${iid}.zip`));
};
