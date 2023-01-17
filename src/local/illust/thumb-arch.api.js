import AS from 'assert';
import { createReadStream } from 'fs';
import { parse, resolve } from 'path';



export const method = 'get';
export const parseResult = false;
export const parseProfile = true;
export const handle = ({ file, $profile: profile }, ctx) => {
	AS(file, `未指定~[文件]~{${file}}`);


	const path = resolve(profile.dir.illustArchive, file);

	ctx.type = parse(path).ext;
	ctx.set('Cache-Control', 'max-age=3600');


	return createReadStream(path);
};
