module.exports = function($) {
	let { C, R, T } = $;

	let list = _fs.readdirSync(R(C.path.cache, 'header'));
	let dict = {};

	list.map(function(file) {
		dict[file.split('.')[0]] = true;
	});

	return async function(raw) {
		let { uid, file, force } = raw;

		let path = R(C.path.cache, 'header', `${uid}.png`);

		if(!dict[uid] || force) {
			let url = `https://i.pximg.net/user-profile/img/${file}`;
			let thumbStream = await T.get(url, 2, false);

			let saveStream = _fs.createWriteStream(path);

			await new Promise(function(resolve) {
				saveStream.on('finish', function() {
					dict[uid] = true;
					resolve();
				});

				thumbStream.pipe(saveStream);
			});
		}

		return {
			_stat: 1,
			_type: 'jpg',
			_data: _fs.createReadStream(path)
		};
	};
};