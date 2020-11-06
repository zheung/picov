const PA = require('path');

const Desire = require('desire');

global.__main = {
	dir: PA.parse(require.main.filename).dir,
	R(...paths) { return PA.resolve(__main.path, ...paths); }
};

const parseConf = function(C) {
	const RD = function(...paths) { return PA.resolve(C.__fold, ...paths); };

	if(C.name === undefined || C.name === null) { C.name = PA.parse(__main).name; }
	if(C.path === undefined || C.path === null) { C.path = {}; }
	if(C.log === undefined || C.log === null) { C.log = {}; }

	if(C.log.path) { C.log.path = RD(C.log.path); }

	const parsePathRecur = function(object) {
		for(const key in object) {
			const value = object[key];
			const type = typeof value;

			if(type == 'string') {
				object[key] = RD(value);
			}
			else if(type == 'object' || type) {
				parsePathRecur(value);
			}
		}
	};

	parsePathRecur(C.path);

	return C;
};

(async function() {
	// 服务器配置
	const C = parseConf(await require('./libs/conf')('server'));

	// 日志
	global.G = Desire.initLogger(C.name, C.log.level, C.log.path);

	// 路由
	const { folds, faces, prxys } = await require('./libs/rout')();

	// 加载服务器
	Desire({
		host: C.serv.host,
		port: C.serv.port,
		path: C.serv.path,

		// 路由
		folds,
		faces,
		prxys,
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

		paths: {
		}
	});
}());
