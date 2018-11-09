module.exports = function($) {
	const { C, Request } = $;

	return async function(path) {
		return new Promise(function(resolve) {
			let option = {
				url: path,
				method: 'HEAD',
				headers: {
					'Cookie': `PHPSESSID=${C.cookie}`,
					'Referer': 'http://www.pixiv.net/',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36'
				},

				proxy: C.proxy
			};

			Request(option)
			.on('response', function(response) {
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
};