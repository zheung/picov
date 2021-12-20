import AS from 'assert';
import { createReadStream, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { dirCacheThumb } from '../../../lib/global.dir.js';
import { C } from '../../../lib/global.js';
import { getBuffer } from '../get.lib.js';


const method = 'get';
const parseResult = false;
const handle = async (raw, ctx) => {
	const profile = C.profile[raw.who];
	AS(profile, `未找到~[档案]~{${raw.who}}`);

	const { time, token, size = '50', ext } = raw;

	const fileThumb = resolve(dirCacheThumb, `user-header-${token}-${size}${ext}`);

	if(existsSync(fileThumb)) {
		ctx.type = ext;

		return createReadStream(fileThumb);
	}

	const bufferThumb = await getBuffer(
		`https://i.pximg.net/user-profile/img/${time}/${token}_${size}${ext}`,
		profile.cookie,
	);

	writeFileSync(fileThumb, bufferThumb);

	ctx.type = ext;
	return bufferThumb;
};


export { method, handle, parseResult };