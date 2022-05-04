import { resolve } from 'path';

import Server from '@nuogz/desire';

import { dirProject } from './lib/global.dir.js';
import { C, G } from './lib/global.js';

import initRoute from './lib/initRoute.js';

import initMareParseResult from './lib/mare/parseResult.mare.js';
import initMareParseProfile from './lib/mare/parseProfile.mare.js';


const { folds, faces } = await initRoute(resolve(dirProject, 'app'));

new Server({
	name: '服务',
	host: C.server.host,
	port: C.server.port,

	mare: {
		before: ['parseRaw', initMareParseProfile],
		after: [initMareParseResult],
	},

	facePrefix: '/api',

	faces,
	folds,

	logger: G,

	wock: {
		disable: false,
		route: 'wock',
		ping: false,
	},
}).start();
