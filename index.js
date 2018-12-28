module.exports = async function($) {
	// 应用环境
	await require('./libs/init')($);

	$.RoutMap = {
		before: [
			require('./libs/middle/parseRaw'),
		],
		routs: [],
	};

	// 路由
	await require('./libs/rout')($, $.RoutMap.routs);

	await $.Harb($.RoutMap);
};