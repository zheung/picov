import { C } from '../../../lib/global.js';


export const method = 'post';
export const handle = ({ path }) => {
	C.$.edit('path', paths => {
		paths._dirIllustArch = path.replace(/\\/g, '/');

		return paths;
	});


	return C.path.dirIllustArch;
};
