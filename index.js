import './index.env.js';
import { dirPackage, C, G } from '@nuogz/pangu';

import './lib/db.js';

import './lib/day.js';

import { resolve } from 'path';

import { ensureDirSync } from 'fs-extra/esm';

import Desire from '@nuogz/desire';
import readRoute from '@nuogz/desire-route';

import initMareParseProfile from './lib/mare/parseProfile.mare.js';



ensureDirSync(C.dir.cacheIllustThumb);
ensureDirSync(C.dir.cacheIllust);


const { folds, faces } = await readRoute(resolve(dirPackage, 'src'));


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
