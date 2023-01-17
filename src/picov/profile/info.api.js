import { C } from '@nuogz/pangu';

import AS from 'assert';

import Moment from 'moment';



export const method = 'get';
export const handle = ({ who }, ctx) => {
	const profile = C.profile[who];

	AS(profile, `未找到~[档案]~{${who}}`);

	ctx.cookies.set('who', profile.name, {
		expires: Moment().add(1, 'month').toDate(),
		httpOnly: false,
		overwrite: true
	});

	return profile;
};
