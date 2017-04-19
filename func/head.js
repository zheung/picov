module.exports = async (path) => {
	return new Promise((resolve, reject) => {
		let option = {
			url: path,
			method: 'HEAD',
			headers: {
				'Cookie': `PHPSESSID=${conf.cookie}`,
				'Referer': 'http://www.pixiv.net/'
			}
		};

		request(option).on('response', function(response) {
			if(response.statusCode != 200)
				reject(response.statusCode);
			else
				resolve(200);
		})
		.on('error', function(err) {
			log(err);

			reject(err);
		});
	});
};