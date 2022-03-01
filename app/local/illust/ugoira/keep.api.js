import AS from 'assert';
import { resolve } from 'path';

import FX from 'fs-extra';

import { C } from '../../../../lib/global.js';


export const method = 'post';
export const handle = raw => {
	const { iid } = raw;

	AS(~~iid, `无效~[IID]~{${iid}}`);

	FX.moveSync(
		resolve(C.path.dirUgoiraNew, `ugoira-${iid}.zip`),
		resolve(C.path.dirUgoiraSaved, `ugoira-${iid}.zip`),
	);
};
