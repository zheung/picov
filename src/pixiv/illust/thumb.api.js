import { C } from '@nuogz/pangu';

import { createReadStream, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { getBuffer } from '../get.lib.js';



export const method = 'get';
export const toSuccess = false;
export const parseProfile = true;
export const handle = async ({ iid, time, type: typeIllust, master, $profile: profile }, ctx) => {
	const typeThumb = !master ? 'master' : 'square';

	const fileThumb = resolve(C.dir.cacheIllustThumb, `thumb-${typeThumb}-${iid}.jpg`);

	if(existsSync(fileThumb)) {
		ctx.set('Cache-Control', 'max-age=3600');
		ctx.type = '.jpg';

		return createReadStream(fileThumb);
	}

	const bufferThumb = await getBuffer(
		`https://i.pximg.net/c/360x360_70/img-master/img/${time}/${iid}${~~typeIllust == 2 ? '' : '_p0'}_${typeThumb}1200.jpg`,
		profile.cookie,
	);

	writeFileSync(fileThumb, bufferThumb);


	ctx.set('Cache-Control', 'max-age=3600');
	ctx.type = '.jpg';


	return bufferThumb;
};
