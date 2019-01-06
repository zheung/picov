module.exports = async function($) {
	let { G, C } = $;

	$.T = require('./tool')($);

	$.FsExtra = require('fs-extra');
	$.Request = require('request');
	$.Bluebird = require('bluebird');
	$.JsDom = require('jsdom');

	$.FsExtra.ensureDirSync(R($.C.path.large));
	$.FsExtra.ensureDirSync(R($.C.path.cache, 'large'));
	$.FsExtra.ensureDirSync(R($.C.path.cache, 'thumb'));

	$.B = {};

	$.Moment = E.Moment;

	$.A = await require('./funcMap')($, C.path.anlz);
	G.info('加载 [解析]');

	let auth = require('../.auth');
	$.DB = await require('./mongo')(auth.picov);

	G.info('加载 [环境]');
};