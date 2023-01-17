import AS from 'assert';
import { resolve } from 'path';

import { copySync, moveSync } from 'fs-extra/esm';



export const method = 'post';
export const parseProfile = true;
export const handle = ({ file, type, isCopy, $profile: profile }) => {
	AS(file, `无效~[文件]~{${file}}`);
	AS(profile.dir[type], `无效~[文件夹]~{${file}}`);


	(isCopy ? copySync : moveSync)(
		resolve(profile.dir.illustPrepare, file),
		resolve(profile.dir[type], file),
	);
};
