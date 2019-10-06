module.exports = async function($) {
	let { G, C } = $;


	G.info('加载 [公共库]');
	$.FsExtra = require('fs-extra');
	$.Request = require('request');
	$.Bluebird = require('bluebird');
	$.JsDom = require('jsdom');

	G.info('加载 [工具]');
	$.T = require('./tool')($);

	G.info('创建 [工作目录]');
	$.FsExtra.ensureDirSync(R($.C.path.large));
	$.FsExtra.ensureDirSync(R($.C.path.cache, 'large'));
	$.FsExtra.ensureDirSync(R($.C.path.cache, 'thumb'));
	$.FsExtra.ensureDirSync(R($.C.path.cache, 'ugoira'));
	$.FsExtra.ensureDirSync(R($.C.path.header));

	$.B = {};

	$.Moment = E.Moment;

	G.info('加载 [解析]');
	$.A = await $.T.dap(C.path.anlz);

	G.info('加载 [数据库]');
	let auth = require('../.auth');
	$.DB = await require('./postgres')(auth.postgres, G);

	G.info('加载 [状态映射]');
	$.BM = await require('./bitmap')($);

	G.info('加载 [自定义数据]');
	$.CC = require('../custom');
};