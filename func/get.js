module.exports = async (path, type, isLog = true) => {
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
			if(isLog) L('请求', path);

			request(option, function (error, response, buffer) {
				if(error)
					reject(error);
				else
					resolve(buffer);
			});
		}
		else if(type == 2) {
			if(isLog) L('代理', path);

			resolve(request(option));
		}
		else if(type == 3) {
			if(isLog) L('请求', path);

			request(option, function (error, response, buffer) {
				if(error)
					reject(error);
				else
					resolve(buffer.toString());
			});
		}
	});
};