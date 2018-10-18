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

	tags: {
		'Tags Collection Name 1': [
			['Tag You Like Name 1', 'Tag 1' ],
			['Tag You Like Name 2', 'Tag 2' ],
			['Tag You Like Name 3', 'Tag 3' ]
		],
		'Tags Collection Name 2': [
			['Tag You Like Name 4', 'Tag 4' ],
			['Tag You Like Name 5', 'Tag 5' ],
			['Tag You Like Name 6', 'Tag 6' ]
		]
	}
};