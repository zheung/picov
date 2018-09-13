module.exports = async function(servType, servConf) {
// 组件引用
	let _http = require('http');

	let Koa = require('koa');

	let Router = require('koa-router');
	let Mount = require('koa-mount');
	let Static = require('koa-static');
	let Favicon = require('koa-favicon');

	let app = new Koa();

	let subs = {};
// 设置cookies密钥
	app.keys = ['Picov'];
// 网站图标
	app.use(Favicon(JD('favicon.ico')));
// zlib压缩
	app.use(require('koa-compress')({ threshold: 2048, flush: require('zlib').Z_SYNC_FLUSH }));
// cors请求头
	app.use(require('@koa/cors')());
// 请求参数解析
	app.use(require('koa-bodyparser')());
// 请求参数解析2，将get和post的参数合并到raw参数中，提取token信息
	app.use(async function(ctx, next) {
		let raw = ctx.raw || {};

		if(ctx.request && ctx.request.body) {
			for(let key in ctx.request.body) {
				raw[key] = ctx.request.body[key];
			}
		}

		if(ctx.query) {
			for(let key in ctx.query) {
				raw[key] = ctx.query[key];
			}
		}

		ctx.raw = raw;

		await next();
	});

	if(C.logResponse) {
		app.use(async function(ctx, next) {
			L(`\x1B[32m${ctx.method}\x1B[39m`, ctx.ip, ctx.originalUrl);

			await next();
		});

	}
// 监听端口和地址
	let servHost = C.serv.host || '127.0.0.1';
	let servPort = C.serv.port || 80;

// 根据配置加载不同的子应用
	let paths = [];

	if(C.loadMode == 2) {
		// 读取subs子应用文件夹
		paths = _fs.readdirSync(JD('subs'));

		// 从配置加载 不在subs文件夹 的 子应用路径
		for(let p of C.extraModules) {
			paths.push(J('..', p));
		}
	}
	else {
	// 直接加载指定的子应用;
		paths.push(servType);
	}

// 遍历路径加载子应用
	for(let pathSub of paths) {
	// 读取sub的配置
		let confSub = servConf;

		if(!confSub) {
			try {
				confSub = require(JD('subs', pathSub, 'conf'));
			// 如果没有confSub.serv.path配置，则跳过。
				if(!confSub.serv || !confSub.serv.path) {
					throw 1;
				}
				else if(servType == pathSub) {
					servHost = confSub.serv.host || servHost;
					servPort = confSub.serv.port || servPort;
				}
			}
			catch(e) {
				if(e.code == 'MODULE_NOT_FOUND') {
					LE(`警告：子应用[${pathSub}]缺少配置文件，已跳过`);
				}
				else if(e == 1) {
					LE(`警告：子应用[${pathSub}]缺少配置[path]，已跳过`);
				}

				continue;
			}
		}
	// 创建子koa服务器和子路由器
		let koa = new Koa(), router = Router({ prefix: confSub.serv.path });
	// 子应用的接口变量$
		let $ = subs[pathSub] = {
		// 绝对路径转换
			pa: async function(paths) {
				return JD.apply(this, ['subs', pathSub].concat(paths.split('/')));
			},
		// 绝对路径引用，js文件、json文件，支持重新加载
			rq: async function(paths, reload, repath) {
				let pathRequire = JD.apply(this, ['subs', pathSub].concat(paths.split('/')));

				if(repath) return pathRequire;

				if(reload) delete require.cache[require.resolve(pathRequire)];

				let obj = require(pathRequire);

				return (obj instanceof Function) ? obj($) : obj;
			},
		// 挂载静态目录
			st: async function(path, option, prefix) {
				app.use(Mount(prefix || confSub.serv.path, Static(path, option)));
			},
		// Socket套用
		// 对子应用透明 配置和子koa，方便高级开发
			conf: confSub,
			app: app,
			koa: koa,
		};
	// 选择性加载数据库
		if(confSub.db.type && confSub.db.type.profile) {

			try {
				let dbLib = require(JD('libs', 'db', confSub.db.type));

				let auth = require(JD('subs', pathSub, '.auth'));

				$.db = await dbLib(auth);
			} catch (e) { true; }
		}
	// 正式加载子应用
		await require(JD('subs', pathSub))($, router);
		app.use(router.routes());

		L(`子应用[${pathSub}] 已加载, 路径是 ${confSub.serv.path}`);
	}
// 启动服务器
	let serv = _http.createServer(app.callback());
// 监听端口
	serv.listen(servPort, servHost);

	L(`服务器已启动 监听地址: ${servHost}:${servPort}`);
};