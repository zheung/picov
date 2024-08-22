import { dirWorking, C, G } from '@nuogz/pangu/index.js?i18n&dir&config=.db&log&day';

import './lib/db.js';

import './lib/day.js';

import { resolve } from 'path';

import { ensureDirSync } from 'fs-extra/esm';

import Desire from '@nuogz/desire';
import readRoute from '@nuogz/desire-route';

import initMareParseProfile from './src/lib/mare/parse-profile.mare.lib.js';



ensureDirSync(C.dir.cacheIllustThumb);
ensureDirSync(C.dir.cacheIllust);


const { folds, faces } = await readRoute(resolve(dirWorking, 'src'));


const desire = await new Desire({
	name: '服务',
	host: C.server.host,
	port: C.server.port,

	/** @type {import('@nuogz/desire-harbour').HarbourOption} */
	harbour: {
		mare: {
			before: ['parseRaw', initMareParseProfile],
			after: ['toSuccess'],
		},

		facePrefix: '/api',

		faces,
		folds,

		wock: {
			disable: false,
			route: 'wock',
			ping: false,
		},
	},

	logger: { logger: G },
});

desire.start();
