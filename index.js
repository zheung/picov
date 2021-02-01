const PA = require('path');

const Desire = require('@nuogz/desire');

global.__main = {
	dir: PA.parse(require.main.filename).dir,
	R(...paths) { return PA.resolve(__main.path, ...paths); }
};

const parseWock = function(raw, mares) {
	if(
		raw === null ||
		raw === undefined ||
		raw === false ||
		raw === 'false' ||
		false
	) {
		return false;
	}

	const wock = {
		prefix: (typeof raw == 'string' ? raw : raw.prefix).trim(),
		ping: (typeof raw == 'string' ? true : raw.ping),
		mares
	};

	if(!wock.prefix) { return false; }

	return wock;
};

(async function() {
	// 服务器配置
	const C = require('./libs/conf')('server');

	global.G = require('@nuogz/gaia/log')(C.log.prefix, C.log.level, C.log.folderSave);

	// 路由
	const { folds, faces } = await require('./libs/rout')();

	// 加载服务器
	const serv = new Desire({
		host: C.serv.host,
		port: C.serv.port,
		path: C.serv.path,

		// 路由
		folds,
		faces,
		// 中间件
		mare: {
			// 前置
			before: [
				require('./libs/mare/parseRaw'),
			],
			// 后置
			after: [],
		},

		http2: {
			enabled: C.serv.http2 ? C.serv.http2.enabled : false,
			perm: C.serv.http2 ? C.serv.http2.perm : false,
		},

		// Websocket
		wock: parseWock(C.serv.wock, {
			after: [
				require('./libs/mare/wock/wrapResult')
			]
		}),

		paths: {},
	}, G);

	serv.start();
}());
