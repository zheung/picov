import { C } from '@nuogz/pangu';



const maps = [
	{ prefix: '/', location: '../dist' },
];

C.profile.forEach((profile) => {
	maps.push({ prefix: `/ugoira/prepare/${profile.name}`, location: profile.dir.ugoiraPrepare });
	maps.push({ prefix: `/ugoira/archive/${profile.name}`, location: profile.dir.ugoiraArchive });
});



export default maps;
