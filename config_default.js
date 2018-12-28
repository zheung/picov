module.exports = {
	name: 'picov',

	serv: {
		host: '0.0.0.0',
		port: 910,
		path: '/',
		http2: false,
		pems: {
			key: 'Your Key Path',
			cert: 'Your Cert Path'
		}
	},

	cookie: 'Your PHPSESSID',

	retry: 5,

	path: {
		large: 'Your Large Picture Path',
		cache: 'Your Cache Path'
	},
};