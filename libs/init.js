module.exports = async function($) {
	$.T = require('./tool');

	E.T = $.T;

	E.FsExtra = require('fs-extra');
	E.Request = require('request');
	E.Bluebird = require('bluebird');
	E.JsDom = require('jsdom');

	E.FsExtra.ensureDirSync($.J($.C.path.large));
	E.FsExtra.ensureDirSync($.J($.C.path.cache, 'large'));
	E.FsExtra.ensureDirSync($.J($.C.path.cache, 'thumb'));

	E.picov = {
		J: $.J,
		C: $.C,
		F: {
			get: require('./get'),
			head: require('./head')
		},
		W: {
			listFollow: require('../work/listFollow'),
			listSearch: require('../work/listSearch'),
			listAuthor: require('../work/listAuthor'),
			thumb: require('../work/thumb'),
			save: require('../work/save')
		}
	};

	let auth = require('../.auth');
	let db = require('./mongo');
	$.db = await db(auth.picov);
};