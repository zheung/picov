import AS from 'assert';
import { resolve } from 'path';

import FX from 'fs-extra';

import { C } from '../../../lib/global.js';


export const method = 'post';
export const handle = raw => {
	const { file, type, isCopy } = raw;

	AS(file, `无效~[文件]~{${file}}`);
	AS(C.path[type], `无效~[文件夹]~{${file}}`);


	FX[isCopy ? 'copySync' : 'moveSync'](
		resolve(C.path.dirIllustSave, file),
		resolve(C.path[type], file),
	);
};
