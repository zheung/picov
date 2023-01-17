import { C } from '@nuogz/pangu';

import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';



export const method = 'post';
export const handle = async ({ files }) => {
	AS(files, `无效~[文件集]~{${files}}`);

	for(const file of files) {
		await Trash(resolve(C.dir.illustPrepare, file));
	}

	return true;
};
