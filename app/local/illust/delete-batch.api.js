import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';

import { C } from '../../../lib/global.js';


export const method = 'post';
export const handle = async raw => {
	const { files } = raw;

	AS(files, `无效~[文件集]~{${files}}`);

	for(const file of files) {
		await Trash(resolve(C.path.dirIllustSave, file));
	}

	return true;
};
