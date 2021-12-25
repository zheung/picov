import AS from 'assert';
import { resolve } from 'path';

import FX from 'fs-extra';

import { C } from '../../../../lib/global.js';


const method = 'post';
const handle = raw => {
	const { who, iid } = raw;

	const profile = C.profile[who];

	AS(profile, `未找到~[档案]~{${who}}`);
	AS(~~iid, `无效~[IID]~{${iid}}`);

	FX.moveSync(
		resolve(C.path.dirUgoiraSave, `ugoira-${iid}.zip`),
		resolve(C.path.dirUgoira, `ugoira-${iid}.zip`),
	);
};


export { method, handle };