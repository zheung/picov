import { C } from '@nuogz/pangu';

import { createReadStream, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { getBuffer } from '../get.lib.js';



export const method = 'get';
export const parseResult = false;
export const parseProfile = true;
export const handle = async (raw, ctx) => {
	const { _profile: profile, time, token, size = '50', ext } = raw;


	const fileThumb = resolve(C.dir.cacheThumb, `user-header-${token}-${size}${ext}`);

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
