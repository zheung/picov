module.exports = async function({ G, C, db }) {
	let routeArr = [];

	let pathRoute = C.path.route;

	try {
		if(C.path.route) {
			G.info(`加载 [路由]数据: 文件路径{[${pathRoute}]}`);

			routeArr = require(pathRoute);
		}
		else {
			G.info('加载 [路由]数据: 从数据库加载');

			routeArr = await db.queryOnce('SELECT * FROM t_route WHERE row_stat & 1 = 0');
		}
	}
	catch(error) {
		G.fatal(`加载[路由]数据: 失败, ${error.message}`);
	}

	if(!routeArr.length) {
		G.fatal('加载[路由]数据: 失败, 路由为空');

		return;
	}

	return routeArr;
};