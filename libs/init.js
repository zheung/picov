module.exports = async function($) {
	$.T = require('./tool')($);

	$.FsExtra = require('fs-extra');
	$.Request = require('request');
	$.Bluebird = require('bluebird');
	$.JsDom = require('jsdom');

	$.FsExtra.ensureDirSync($.J($.C.path.large));
	$.FsExtra.ensureDirSync($.J($.C.path.cache, 'large'));
	$.FsExtra.ensureDirSync($.J($.C.path.cache, 'thumb'));

	$.wockServ = await require('./wock')($);

	$.B = {};
	$.A = await require('../anlz')($);
	$.W = await require('../center')($);

	let auth = require('../.auth');
	let db = require('./mongo');
	$.db = await db(auth.picov);
};