import { C } from '@nuogz/pangu';

import AS from 'assert';


export const method = 'post';
export const parseProfile = true;
export const handle = ({ path, $who }) => {
	AS(path, `无效~[路径]~{${path}}`);

	C.$.edit('profile', profiles => {
		profiles.find(p => p.name == $who).dir._illustArchive = path.replace(/\\/g, '/');

		return profiles;
	});
};
