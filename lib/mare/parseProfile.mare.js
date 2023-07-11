import { C } from '@nuogz/pangu';

import AS from 'assert';



const initMareParseProfile = $ => {
	return async (ctx, next) => {
		const { parseProfile } = ctx.face.option;


		if(!parseProfile) { return await next(); }


		const who = ctx.cookies.get('who');

		const profile = C.profile?.[who];

		if(profile && ctx?.raw) {
			ctx.raw.$who = who;
			ctx.raw.$profile = profile;

			if(ctx?.raw?.$keysFrom) {
				ctx.raw.$keysFrom.$who = 'parseProfile';
				ctx.raw.$keysFrom.$profile = 'parseProfile';
			}
		}

		if(parseProfile != 'no-check') { AS(profile, `未找到~[档案]~{${who}}`); }

		await next();
	};
};


export default initMareParseProfile;
