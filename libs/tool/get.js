module.exports = function({ G, C, Request }) {
	return async function(path, type, isLog = false) {
		return new Promise(function(resolve, reject) {
			let option = {
				url: path,
				headers: {
					'Cookie': `PHPSESSID=${C.cookie}`,
					'Referer': 'http://www.pixiv.net/',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36'
				},
				encoding: null,

				proxy: C.proxy
			};

			if(type == 1) {
				if(isLog) { G.trace('请求', path); }

				Request(option, function (error, response, buffer) {
					if(error) {
						reject(error);
					}
					else
						resolve(buffer);
				});
			}
			else if(type == 2) {
				if(isLog) { G.trace('代理', path); }

				resolve(Request(option));
			}
			else if(type == 3) {
				if(isLog) { G.trace('请求', path); }

				Request(option, function (error, response, buffer) {
					if(error) {
						reject(error);
					}
					else {
						resolve(buffer.toString());
					}
				});
			}
		});
	};
};