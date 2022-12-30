import AS from 'assert';

import FX from 'fs-extra';

import { C } from '../../../lib/global.js';


export const method = 'get';
export const handle = raw => {
	const { who } = raw;

	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);


	return FX.readdirSync(C.path.dirIllustArch).sort((a, b) => {
		const [idA, pageA] = a.split(/_p|\./);
		const [idB, pageB] = b.split(/_p|\./);

		if(idA != idB) { return idA - idB; }

		return pageA - pageB;
	});
};