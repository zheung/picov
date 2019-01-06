module.exports = function($) {
	let { G, C, R, T } = $;

	let list = _fs.readdirSync(R(C.path.cache, 'thumb'));
	let dict = {};

	list.map((file) => {
		dict[file.split('.')[0]] = true;
	});

	return async function(raw) {
		let { iid, type, force } = raw;

		let path = R(C.path.cache, 'thumb', `${iid}.png`);

		if(!dict[iid] || force) {
			let url = `https://i.pximg.net/c/150x150/img-master/img/${raw.time}/${raw.iid}${~~type == 2 ? '' : '_p0'}_master1200.jpg`;
			let thumbStream = await T('get')(url, 2);

			let saveStream = _fs.createWriteStream(path);

			await new Promise(function(resolve) {
				saveStream.on('finish', function() {
					dict[iid] = true;
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