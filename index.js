module.exports = async function($) {
	// 应用环境
	await require('./libs/init')($);

	$.RoutMap = {
		before: [
			require('./libs/middle/parseResult'),
			require('./libs/middle/parseRaw'),
		],
		after: [
		],
		routs: [],
		wock: {
			after: [
				require('./libs/middle/wock/wrapResult')
			]
		}
	};

	// 路由
	await require('./libs/rout')($, $.RoutMap.routs);

	await $.Harb($.RoutMap);
};