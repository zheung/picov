import { C } from '@nuogz/pangu';

import AS from 'assert';

import Moment from 'moment';



export const method = 'get';
export const handle = (raw, ctx) => {
	const profile = C.profile[raw.who];

	AS(profile, `未找到~[档案]~{${raw.who}}`);

	ctx.cookies.set('who', profile.name, {
		expires: Moment().add(1, 'month').toDate(),
		httpOnly: false,
		overwrite: true
	});

	return profile;
};
