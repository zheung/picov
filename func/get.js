
module.exports = async (cookie, path) => {
	return new Promise(resolve => {
		let options = {
			hostname: 'www.pixiv.net',
			path: path,
			method: 'GET',
			headers: {
				'Accept-Encoding': '',
				'Cookie': `PHPSESSID=${cookie}`
			}
		};

		http.request(options, res => {
			let rawData = [];

			res.on('data', (chunk) => {
				rawData.push(chunk);
			});

			res.on('end', () => {
				resolve(Buffer.concat(rawData));
			});
		}).end();
	});
};