import { C } from '../../../lib/global.js';


export const method = 'post';
export const handle = ({ path }) => {
	const config = C.read('path');

	config._dirIllustArch = path.replace(/\\/g, '/');

	C.save('path', config);
	C.load('path');

	return C.path.dirIllustArch;
};
