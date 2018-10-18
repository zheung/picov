module.exports = async (path, type, isLog = false) => {
	return new Promise((resolve, reject) => {
		let option = {
			url: path,
			headers: {
				'Cookie': `PHPSESSID=${E.picov.C.cookie}`,
				'Referer': 'http://www.pixiv.net/',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36'
			},
			encoding: null,

			proxy: 'http://127.0.0.1:1080'
		};

		if(type == 1) {
			if(isLog) L('请求', path);

			E.Request(option, function (error, response, buffer) {
				if(error) {
					reject(error);
				}
				else
					resolve(buffer);
			});
		}
		else if(type == 2) {
			if(isLog) L('代理', path);

			resolve(E.Request(option));
		}
		else if(type == 3) {
			if(isLog) L('请求', path);

			E.Request(option, function (error, response, buffer) {
				if(error)
					reject(error);
				else
					resolve(buffer.toString());
			});
		}
	});
};