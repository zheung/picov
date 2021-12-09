import AS from 'assert';

import { C } from '../../../lib/global.js';
import { getJSON } from '../get.lib.js';
import statesIllust from './State.lib.js';


const method = 'wock';
const handle = async (illust, who, wock) => {
	const profile = C.profile[who];
	AS(profile, `未找到~[档案]~{${who}}`);

	const { iid, count, type, force } = illust;


	const info = await getJSON(`https://www.pixiv.net/touch/ajax/illust/details?illust_id=${iid}`, profile.cookie);
};


export { method, handle };