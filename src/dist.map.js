import { C } from '@nuogz/pangu';



const maps = [
	{ prefix: '/', location: '../dist' },
];

Object.entries(C.profile).forEach(([id, profile]) => {
	maps.push({ prefix: `/ugoira/prepare/${id}`, location: profile.dir.ugoiraPrepare });
	maps.push({ prefix: `/ugoira/archive/${id}`, location: profile.dir.ugoiraArchive });
});



export default maps;
