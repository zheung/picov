import AS from 'assert';
import { createReadStream } from 'fs';
import { parse, resolve } from 'path';


import { C } from '../../../lib/global.js';


export const method = 'get';
export const optionAPI = { parseResult: false };
export const handle = (raw, ctx) => {
	const { file } = raw;

	AS(file, `未指定~[文件]~{${file}}`);


	const path = resolve(C.path.dirIllustSave, file);

	ctx.type = parse(path).ext;
	ctx.set('Cache-Control', 'max-age=3600');

	return createReadStream(path);
};
