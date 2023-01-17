import AS from 'assert';
import { resolve } from 'path';

import Trash from 'trash';



export const method = 'post';
export const parseProfile = true;
export const handle = ({ iid, $profile: profile }) => {
	AS(~~iid, `无效~[IID]~{${iid}}`);


	return Trash(resolve(profile.dir.ugoiraPrepare, `ugoira-${iid}.zip`));
};
