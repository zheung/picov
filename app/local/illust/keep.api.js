import AS from 'assert';
import { resolve } from 'path';

import FX from 'fs-extra';

import { C } from '../../../lib/global.js';


export const method = 'post';
export const handle = raw => {
	const { file } = raw;

	AS(file, `无效~[文件]~{${file}}`);

	FX.moveSync(
		resolve(C.path.dirIllustSave, file),
		resolve(C.path.dirIllustArch, file),
	);
};
