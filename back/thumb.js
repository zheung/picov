module.exports = function($) {
	let { J, C, T } = $;

	let list = _fs.readdirSync(J(C.path.cache, 'thumb'));
	let dict = {};

	list.map((file) => {
		dict[file.split('.')[0]] = true;
	});

	return {
		c: async function(raw) {
			let { iid, fr } = raw;

			let path = J(C.path.cache, 'thumb', `${iid}.png`);

			if(!dict[iid] || fr) {
				let thumbStream = await T.get(`https://i.pximg.net/c/150x150/img-master/img/${raw.time}/${raw.iid}${~~raw.ugoira ? '' : '_p0'}_master1200.jpg`, 2);
				let cacheStream = _fs.createWriteStream(path);

				await new Promise(function(resolve) {
					cacheStream.on('finish', function() {
						dict[iid] = true;

						resolve();
					});

					thumbStream.pipe(cacheStream);
				});
			}

			return {
				success: true,
				mime: true,
				data: [ path ]
			};
		}
	};
};