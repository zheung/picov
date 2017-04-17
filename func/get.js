let request = require('request');

module.exports = async (cookie, path) => {
	return new Promise((resolve, reject) => {
		let options = {
			url: 'https://www.pixiv.net'+path,
			headers: {
				'Cookie': `PHPSESSID=${cookie}`
			},
			encoding: null
		};

		request(options, function (error, response, buffer) {
			if(error)
				reject(error);
			else
				resolve(buffer);
		});
	});
};