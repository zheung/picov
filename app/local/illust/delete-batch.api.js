import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';


import { C } from '../../../lib/global.js';


const method = 'post';
const handle = async raw => {
	const { who, files } = raw;

	const profile = C.profile[who];

	AS(profile, `未找到~[档案]~{${who}}`);
	AS(files, `无效~[文件集]~{${files}}`);

	for(const file of files) {
		await Trash(resolve(C.path.dirIllustSave, file));
	}

	return true;
};


export { method, handle };