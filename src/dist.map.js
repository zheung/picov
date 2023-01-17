import { C } from '@nuogz/pangu';



const maps = [
	{ route: '/', path: '../dist' },
];

Object.entries(C.profile).forEach(([id, profile]) => {
	maps.push({ route: `/ugoira/prepare/${id}`, path: profile.dir.ugoiraPrepare });
	maps.push({ route: `/ugoira/archive/${id}`, path: profile.dir.ugoiraArchive });
});



export default maps;
