import { C } from '@nuogz/pangu';

import AS from 'assert';



const initMareParseProfile = $ => {
	return async (ctx, next) => {
		const { rout } = ctx;
		const { parseProfile } = rout.option;


		if(!parseProfile) { return await next(); }


		const who = ctx.cookies.get('who');

		const profile = C.profile?.[who];

		if(profile && ctx?.raw) {
			ctx.raw._who = who;
			ctx.raw._profile = profile;

			if(ctx?.raw?._keysFrom) {
				ctx.raw._keysFrom._who = 'parseProfile';
				ctx.raw._keysFrom._profile = 'parseProfile';
			}
		}

		if(parseProfile != 'no-check') { AS(profile, `未找到~[档案]~{${who}}`); }

		await next();
	};
};


export default initMareParseProfile;
