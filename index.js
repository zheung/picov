const PA = require('path');

const Desire = require('desire');

global.__main = {
	dir: PA.parse(require.main.filename).dir,
	R(...paths) { return PA.resolve(__main.path, ...paths); }
};

(async function() {
	// 服务器配置
	const C = require('./libs/conf')('server');

	// 日志
	global.G = Desire.initLogger(C.name, C.log.level, C.log.path);

	// 路由
	const { folds, faces } = await require('./libs/rout')();

	// 加载服务器
	Desire({
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

		harb: null,

		http2: {
			enabled: C.serv.http2 ? C.serv.http2.enabled : false,
			perm: C.serv.http2 ? C.serv.http2.perm : false,
		},

		// Websocket
		wock: {
			enabled: C.serv.wock ? C.serv.wock.enabled : false,
			prefix: C.serv.wock ? C.serv.wock.prefix : false,
			after: [
				require('./libs/mare/wock/wrapResult')
			]
		},

		paths: {}
	});
}());
