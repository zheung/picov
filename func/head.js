module.exports = async (path) => {
	return new Promise((resolve) => {
		let option = {
			url: path,
			method: 'HEAD',
			headers: {
				'Cookie': `PHPSESSID=${C.C.cookie}`,
				'Referer': 'http://www.pixiv.net/'
			}
		};

		Request(option).on('response', function(response) {
			if(response.statusCode != 200)
				resolve(response.statusCode);
			else
				resolve(200);
		})
		.on('error', function(err) {
			L(err);

			resolve(err);
		});
	});
};