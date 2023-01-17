import AS from 'assert';
import { createReadStream } from 'fs';
import { parse, resolve } from 'path';



export const method = 'get';
export const parseResult = false;
export const parseProfile = true;
export const handle = ({ location, file, $profile: profile }, ctx) => {
	AS(file, `未指定~[文件]~{${file}}`);

	const dirIllust = location == 'prepare'
		? profile.dir.illustPrepare
		: location == 'archive'
			? profile.dir.illustArchive
			: undefined;


	const path = resolve(dirIllust, file);

	ctx.type = parse(path).ext;
	ctx.set('Cache-Control', 'max-age=3600');


	return createReadStream(path);
};
