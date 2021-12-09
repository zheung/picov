import AS from 'assert';

import { C } from '../../../lib/global.js';
import statesIllust from './State.lib.js';


const method = 'wock';
const handle = async (raw, wock) => {
	const profile = C.profile[raw.who];

	AS(profile, `未找到~[档案]~{${raw.who}}`);

	statesIllust.pull(raw.illusts, wock);
};


export { method, handle };