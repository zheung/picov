import { C } from '@nuogz/pangu';

import AS from 'assert';


export const method = 'post';
export const parseProfile = true;
export const handle = ({ path, $profile: profile, $who }) => {
	AS(path, `无效~[路径]~{${path}}`);

	C.$.edit('profile', profiles => {
		profiles[$who].dir._illustArchive = path.replace(/\\/g, '/');

		return profiles;
	});
};
