import { C } from '@nuogz/pangu';

import AS from 'assert';
import { readdirSync } from 'fs';



export const method = 'get';
export const handle = ({ who }) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);


	return readdirSync(C.dir.illustArch).sort((a, b) => {
		const [idA, pageA] = a.split(/_p|\./);
		const [idB, pageB] = b.split(/_p|\./);

		if(idA != idB) { return idA - idB; }

		return pageA - pageB;
	});
};
