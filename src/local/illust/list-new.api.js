import { C } from '@nuogz/pangu';

import AS from 'assert';
import { readdirSync } from 'fs';



export const method = 'get';
export const handle = ({ location, who }) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);

	const dirIllust = location == 'prepare'
		? C.dir.illustPrepare
		: location == 'archive'
			? C.dir.illustArchive
			: undefined;


	AS(dirIllust, `无效~[位置]~{${location}}`);


	return readdirSync(dirIllust).sort((a, b) => {
		const [idA, pageA] = a.split(/_p|\./);
		const [idB, pageB] = b.split(/_p|\./);

		if(idA != idB) { return idA - idB; }

		return pageA - pageB;
	});
};
