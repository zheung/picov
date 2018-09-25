module.exports = async function() {
// Node模块 下划线 + 2~3个小写字母
	global._fs = require('fs-extra');
	global._pa = require('path');
	global._qs = require('querystring');
	global._ul = require('url');
	global._os = require('os');
	global._http = require('http');
	global._cr = require('crypto');
// 第三方组件 大写开头的英文单词
	global.Request = require('request');
	global.Moment = require('moment');
	global.Jsdom = require('jsdom');
	global.Bluebird = require('bluebird');

// 常用功能简写 1~2个大写字母
	global.J = global._pa.join;
	global.D = J(__dirname, '..');
	global.L = global.console.log;
	global.LE = global.console.error;

	global.Moment.locale('zh-cn');

	global.JD = function(...paths) {
		return global.J(D, ...paths);
	};
// 必要全局变量 1~2个大写字母
	global.T = require(JD('tool'));

	global.C = require(JD('conf'));
};