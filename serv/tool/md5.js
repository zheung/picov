let _cr = require('crypto');

module.exports = {
	calcFile: async function(path) {
		return new Promise(function(resolve) {
			let hash = _cr.createHash('md5');
			let readStream = _fs.createReadStream(path);

			readStream.on('data', hash.update.bind(hash));
			readStream.on('end', function () {
				resolve(hash.digest('hex').toUpperCase());
			});
		});
	},
	calcString: async function(str) {
		let hash = _cr.createHash('md5');

		hash.update(str);

		return hash.digest('hex').toUpperCase();
	}
};