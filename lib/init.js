module.exports = async() => {
	global.fs = require('fs');
	global.path = require('path');
	global.qs = require('querystring');
	global.http = require('http');
	global.https = require('https');
	global.url = require('url');

	global.log = (0 ||console).log;
	global._d = path.join(__dirname, '..');

	global.jsdom = require('jsdom');
	global.request = require('request');

	global.func = {
		get: require('../func/get'),
		head: require('../func/head')
	},

	global.work = {
		list: require('../work/list'),
		thumb: require('../work/thumb'),
		save: require('../work/save')
	};

	global.cache = await require('../lib/cache')();

	global.conf = require('../config');
};