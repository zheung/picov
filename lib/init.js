module.exports = async() => {
	global.fs = require('fs-extra');
	global.path = require('path');
	global.qs = require('querystring');
	global.http = require('http');
	global.https = require('https');
	global.url = require('url');

	global.L = (0 || console).log;

	global.soger = (socket) => {
		if(socket) {
			if(socket.soger) return socket.soger;

			return socket.soger = {
				l: (...args) => (!socket.downLog ? undefined : socket.emit('log', args.join(' '))),
				r: (stamp, ...args) => (!socket.downLog ? undefined : socket.emit('log', args.join(' '), stamp)),
				e: (event, ...args) => (!socket.downLog ? undefined : socket.emit(event, args.join(' '))),

				ll: (...args) => L(...args) || (!socket.downLog ? undefined : socket.emit('log', args.join(' '))),
				rl: (stamp, ...args) => L(...args) || (!socket.downLog ? undefined : socket.emit('log', args.join(' '), stamp)),
				el: (event, ...args) => L(...args) || (!socket.downLog ? undefined : socket.emit(event, args.join(' '))),

				rc: (stamp, color, ...args) => (!socket.downLog ? undefined : socket.emit('log', args.join(' '), stamp, color)),

				lf: (...args) => socket.emit('log', args.join(' ')),
				rf: (stamp, ...args) => socket.emit('log', args.join(' '), stamp),
				ef: (event, ...args) => socket.emit(event, args.join(' ')),
				llf: (...args) => L(...args) || socket.emit('log', args.join(' ')),
				rlf: (stamp, ...args) => L(...args) || socket.emit('log', args.join(' '), stamp),
				elf: (event, ...args) => L(...args) || socket.emit(event, args.join(' ')),
				rcf: (stamp, color, ...args) => socket.emit('log', args.join(' '), stamp, color)
			};
		}
	};

	global._d = path.join(__dirname, '..');

	global.jsdom = require('jsdom');
	global.request = require('request');

	global.func = {
		get: require('../func/get'),
		head: require('../func/head')
	},

	global.work = {
		listFollow: require('../work/listFollow'),
		listSearch: require('../work/listSearch'),
		thumb: require('../work/thumb'),
		save: require('../work/save')
	};

	global.cache = await require('../lib/cache')();

	global.conf = require('../config');

	fs.ensureDirSync(conf.path.large);
	fs.ensureDirSync(path.join(conf.path.cache, 'large'));
	fs.ensureDirSync(path.join(conf.path.cache, 'thumb'));

	try {
		global.dictDown = require('../dictDown.json');
		global.dictDing = require('../dictDing.json');
	}
	catch(e) {
		L(e);
		global.dictDown = {};
		global.dictDing = {};
	}
};