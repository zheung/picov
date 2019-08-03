module.exports = function($) {
	let { C, R, T } = $;

	let list = _fs.readdirSync(R(C.path.cache, 'ugoira'));
	let dict = {};

	list.map(function(file) {
		dict[file.split('_')[0]] = true;
	});

	return async function(raw, ctx) {
		let { iid, time, force } = raw;

		let path = R(C.path.cache, 'ugoira', `${iid}_ugoira1920x1080.zip`);

		if(!dict[iid] || force) {
			let url = `https://i.pximg.net/img-zip-ugoira/img/${time}/${iid}_ugoira1920x1080.zip`;
			let thumbStream = await T.get(url, 2, false);

			let saveStream = _fs.createWriteStream(path);

			await new Promise(function(resolve) {
				saveStream.on('finish', function() {
					dict[iid] = true;
					resolve();
				});

				thumbStream.pipe(saveStream);
			});
		}

		ctx.attachment(`${iid}_ugoira1920x1080.zip`);

		return {
			_stat: 1,
			_type: 'zip',
			_data: _fs.createReadStream(path)
		};
	};
};