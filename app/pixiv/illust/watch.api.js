import AS from 'assert';

import { C } from '../../../lib/global.js';

import stateAdmin from './admin/StateAdmin.lib.js';


export const method = 'wock';
export const handle = async (illusts, who, wock) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);

	stateAdmin.watch(illusts, wock);
};
