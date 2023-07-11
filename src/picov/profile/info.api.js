import { C } from '@nuogz/pangu';

import AS from 'assert';

import Day from 'dayjs';



export const method = 'get';
export const handle = ({ who }, ctx) => {
	const profile = C.profile[who];

	AS(profile, `未找到~[档案]~{${who}}`);

	ctx.cookies.set('who', profile.name, {
		expires: Day().add(1, 'months').toDate(),
		httpOnly: false,
		overwrite: true,
	});

	return profile;
};
