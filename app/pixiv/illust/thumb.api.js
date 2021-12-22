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

	const { iid, time, type: typeIllust, master } = raw;

	const typeThumb = !master ? 'master' : 'square';

	const fileThumb = resolve(dirCacheThumb, `thumb-${typeThumb}-${iid}.jpg`);

	if(existsSync(fileThumb)) {
		ctx.type = '.jpg';

		return createReadStream(fileThumb);
	}

	const bufferThumb = await getBuffer(
		`https://i.pximg.net/c/360x360_70/img-master/img/${time}/${iid}${~~typeIllust == 2 ? '' : '_p0'}_${typeThumb}1200.jpg`,
		profile.cookie,
	);

	writeFileSync(fileThumb, bufferThumb);

	ctx.type = '.jpg';
	return bufferThumb;
};


export { method, handle, parseResult };