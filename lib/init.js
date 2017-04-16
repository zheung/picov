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

	global.func = {
		get: require('../func/get')
	};

	global.work = {
		list: require('../work/list')
	};

	global.conf = require('../config');
};