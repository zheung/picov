import { C } from '@nuogz/pangu';

import AS from 'assert';
import { resolve } from 'path';

import { moveSync } from 'fs-extra/esm';



export const method = 'post';
export const handle = ({ iid }) => {
	AS(~~iid, `无效~[IID]~{${iid}}`);

	moveSync(
		resolve(C.dir.ugoiraNew, `ugoira-${iid}.zip`),
		resolve(C.dir.ugoiraSaved, `ugoira-${iid}.zip`),
	);
};
