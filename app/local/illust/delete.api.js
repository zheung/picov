import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';


import { C } from '../../../lib/global.js';


const method = 'post';
const handle = raw => {
	const { who, file } = raw;

	const profile = C.profile[who];

	AS(profile, `未找到~[档案]~{${who}}`);
	AS(file, `无效~[文件]~{${file}}`);


	return Trash(resolve(C.path.dirIllustSave, file));
};


export { method, handle };