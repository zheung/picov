import AS from 'assert';
import { resolve } from 'path';

import FX from 'fs-extra';

import { C } from '../../../lib/global.js';


const method = 'post';
const handle = raw => {
	const { who, file } = raw;

	const profile = C.profile[who];

	AS(profile, `未找到~[档案]~{${who}}`);
	AS(file, `无效~[文件]~{${file}}`);

	FX.moveSync(
		resolve(C.path.dirIllustSave, file),
		resolve(C.path.dirIllustArch, file),
	);
};


export { method, handle };