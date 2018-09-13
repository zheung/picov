let conf = { serv: {} };

try {
	conf = require(JD('..', 'conf.js'));
} catch (e) { true; }

module.exports = {
	serv: {
		host: conf.serv.conf || '0.0.0.0',
		port: conf.serv.port || 910,
		path: '/'
	},

	pathCode: '../../../back',

	db: {
		type: 'mongo',
		profile: 'picov'
	},

	cookie: conf.cookie || '',
	retry: conf.retry || 5,
	path: conf.path || {},
	tags: conf.tags || {},
};