module.exports = async() => {
	global.fs = require('fs');
	global.path = require('path');
	global.qs = require('querystring');
	global.http = require('http');
	global.https = require('https');
	global.url = require('url');

	global.log = (0 ||console).log;

	global.soger = (socket) => {
		return {
			l: (...args) => socket.emit('log', args.join(' ')),
			r: (stamp, ...args) => socket.emit('log', args.join(' '), stamp),
			e: (event, ...args) => socket.emit(event, args.join(' ')),
			ll: (...args) => log(...args) || socket.emit('log', args.join(' ')),
			rl: (stamp, ...args) => log(...args) || socket.emit('log', args.join(' '), stamp),
			el: (event, ...args) => log(...args) || socket.emit(event, args.join(' '))
		};
	};

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