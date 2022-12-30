import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';

import { C } from '../../../lib/global.js';


export const method = 'post';
export const handle = raw => {
	const { file } = raw;

	AS(file, `无效~[文件]~{${file}}`);

	return Trash(resolve(C.path.dirIllustSave, file));
};
