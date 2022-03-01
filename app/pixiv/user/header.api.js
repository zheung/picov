import { createReadStream, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { dirCacheThumb } from '../../../lib/global.dir.js';
import { getBuffer } from '../get.lib.js';


export const method = 'get';
export const optionAPI = { parseResult: false, parseProfile: true, };
export const handle = async (raw, ctx) => {
	const { _profile: profile, time, token, size = '50', ext } = raw;


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
