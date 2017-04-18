module.exports = async (path, type) => {
	return new Promise((resolve, reject) => {
		let option = {
			url: path,
			headers: {
				'Cookie': `PHPSESSID=${conf.cookie}`,
				'Referer': 'http://www.pixiv.net/'
			},
			encoding: null
		};

		if(type == 1) {
			log('请求', path);

			request(option, function (error, response, buffer) {
				if(error)
					reject(error);
				else
					resolve(buffer);
			});
		}
		else if(type == 2) {
			log('代理', path);

			resolve(request(option));
		}
	});
};