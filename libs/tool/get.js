module.exports = function({ G, C, Request }) {
	return async function(path, type, useProxy = true) {
		return new Promise(function(resolve, reject) {
			let option = {
				url: path,
				headers: {
					'Cookie': `PHPSESSID=${C.cookie}`,
					'Referer': 'http://www.pixiv.net/',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36'
				},
				encoding: null,

				proxy: useProxy ? C.proxy : null
			};

			if(type == 1) {
				G.trace('请求', path);

				Request(option, function(error, response, buffer) {
					if(error) {
						reject(error);
					}
					else
						resolve(buffer);
				});
			}
			else if(type == 2) {
				G.trace('代理', path);

				resolve(Request(option));
			}
			else if(type == 3) {
				G.trace('请求', path);

				Request(option, function(error, response, buffer) {
					if(error) {
						reject(error);
					}
					else {
						resolve(buffer.toString());
					}
				});
			}
			else if(type == 4) {
				G.trace('请求', path);

				Request(option, function(error, response, buffer) {
					if(error) {
						reject(error);
					}
					else {
						try {
							resolve(JSON.parse(buffer.toString()));
						} catch(error) {
							G.error(`请求: 错误, 无法解析JSON. 路径: ${path}`);

							reject(error);
						}
					}
				});
			}
		});
	};
};