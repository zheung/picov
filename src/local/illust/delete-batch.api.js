import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';



export const method = 'post';
export const parseProfile = true;
export const handle = async ({ files, $profile: profile }) => {
	AS(files, `无效~[文件集]~{${files}}`);

	for(const file of files) {
		await Trash(resolve(profile.dir.illustPrepare, file));
	}

	return true;
};
