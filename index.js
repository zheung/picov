import './index.env.js';
import { dirPackage, C, G } from '@nuogz/pangu';

import { resolve } from 'path';

import Desire from '@nuogz/desire';
import readRoute from '@nuogz/desire-route';

import initMareParseProfile from './lib/mare/parseProfile.mare.js';



const { folds, faces } = await readRoute(resolve(dirPackage, 'src'));

new Desire({
	name: '服务',
	host: C.server.host,
	port: C.server.port,

	mare: {
		before: ['parseRaw', initMareParseProfile],
		after: ['toSuccess'],
	},

	facePrefix: '/api',

	faces,
	folds,

	locale: C.log?.locale,
	logger: G,

	wock: {
		disable: false,
		route: 'wock',
		ping: false,
	},
}).start();
