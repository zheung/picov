import { resolve } from 'path';

import Server from '@nuogz/desire';

import { dirProject } from './lib/global.dir.js';
import { C, G } from './lib/global.js';

import initRoute from './lib/initRoute.js';

import ResultParser from './lib/mare/ResultParser.js';

const { folds, faces } = await initRoute(resolve(dirProject, 'app'));

new Server({
	name: '服务',
	host: C.server.host,
	port: C.server.port,

	mare: {
		before: ['parseRaw'],
		after: [ResultParser],
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