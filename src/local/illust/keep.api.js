import { C } from '@nuogz/pangu';

import AS from 'assert';
import { resolve } from 'path';

import { copySync, moveSync } from 'fs-extra/esm';



export const method = 'post';
export const handle = ({ file, type, isCopy }) => {
	AS(file, `无效~[文件]~{${file}}`);
	AS(C.dir[type], `无效~[文件夹]~{${file}}`);


	(isCopy ? copySync : moveSync)(
		resolve(C.dir.illustSave, file),
		resolve(C.dir[type], file),
	);
};
