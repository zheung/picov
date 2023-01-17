import AS from 'assert';
import { readdirSync } from 'fs';



export const method = 'get';
export const parseProfile = true;
export const handle = ({ location, $profile: profile }) => {
	const dirUgoira = location == 'prepare'
		? profile.dir.ugoiraPrepare
		: location == 'archive'
			? profile.dir.ugoiraArchive
			: undefined;


	AS(dirUgoira, `无效~[位置]~{${location}}`);


	return readdirSync(dirUgoira, 'utf8')
		.map(name => ~~name.match(/^ugoira-(\d+)\./)?.[1])
		.filter(i => i);
};
