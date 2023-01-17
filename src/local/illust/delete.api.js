import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';



export const method = 'post';
export const parseProfile = true;
export const handle = ({ file, $profile: profile }) => {
	AS(file, `无效~[文件]~{${file}}`);

	return Trash(resolve(profile.dir.illustPrepare, file));
};
