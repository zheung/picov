import { C } from '@nuogz/pangu';

import AS from 'assert';



export const method = 'post';
export const handle = ({ path }) => {
	AS(path, `无效~[路径]~{${path}}`);

	C.$.edit('dir', paths => {
		paths._illustArch = path.replace(/\\/g, '/');

		return paths;
	});


	return C.dir.illustArch;
};
