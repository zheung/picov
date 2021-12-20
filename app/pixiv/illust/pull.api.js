import AS from 'assert';

import { C } from '../../../lib/global.js';
import statesIllust from './State.lib.js';


const method = 'wock';
const handle = async (illusts, who, wock) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);

	statesIllust.pull(illusts, wock);
};


export { method, handle };