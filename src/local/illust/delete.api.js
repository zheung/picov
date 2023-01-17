import { C } from '@nuogz/pangu';

import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';



export const method = 'post';
export const handle = ({ file }) => {
	AS(file, `无效~[文件]~{${file}}`);

	return Trash(resolve(C.dir.illustPrepare, file));
};
