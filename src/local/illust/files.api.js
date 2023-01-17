import AS from 'assert';
import { readdirSync } from 'fs';



export const method = 'get';
export const parseProfile = true;
export const handle = ({ location, $profile: profile }) => {
	const dirIllust = location == 'prepare'
		? profile.dir.illustPrepare
		: location == 'archive'
			? profile.dir.illustArchive
			: undefined;


	AS(dirIllust, `无效~[位置]~{${location}}`);


	return readdirSync(dirIllust).sort((a, b) => {
		const [idA, pageA] = a.split(/_p|\./);
		const [idB, pageB] = b.split(/_p|\./);

		if(idA != idB) { return idA - idB; }

		return pageA - pageB;
	});
};
