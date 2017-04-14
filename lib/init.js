module.exports = async() => {
	global.fs = require('fs');
	global.path = require('path');
	global.qs = require('querystring');
	global.http = require('http');
	global.https = require('https');
	global.url = require('url');

	global._c = console;
	global.log = _c.log;
	global._d = path.join(__dirname, '..');
};