import AS from 'assert';
import { resolve } from 'path';

import { moveSync } from 'fs-extra/esm';



export const method = 'post';
export const parseProfile = true;
export const handle = ({ iid, $profile: profile }) => {
	AS(~~iid, `无效~[IID]~{${iid}}`);


	moveSync(
		resolve(profile.dir.ugoiraPrepare, `ugoira-${iid}.zip`),
		resolve(profile.dir.ugoiraArchive, `ugoira-${iid}.zip`),
	);
};
