module.exports = async function($) {
	$.G.info('加载 [环境]');
	await require('./libs/init')($);

	await $.st($.J('dist'), { defer: true });

	$.G.info('加载 [工作中心]');
	await require('./libs/workCenter')();

	$.G.info('加载 [路由]');
	await require('./libs/flow')($);
};