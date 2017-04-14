global.Promise = require('bluebird');

(async() => {
	await require('./lib/init')();
	await require('./lib/serv')();
})();