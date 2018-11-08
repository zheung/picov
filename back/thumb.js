module.exports = function($) {
	let { J, C, F } = $;

	let list = _fs.readdirSync(J(C.path.cache, 'thumb')), dict = {};

	list.map((file) => {
		dict[file.split('.')[0]] = true;
	});

	let has = async function(iid) {
		return dict[iid];
	};

	let set = async function(iid, type = true) {
		dict[iid] = type;
	};

	return {
		c: async function(raw) {
			let iid = raw.iid;
			let fr = raw.fr;
			let cached = await has(iid);

			let path = J(C.path.cache, 'thumb', `${iid}.png`);

			if(cached && !fr) {
				// L('缓存', '小图', iid);
			}
			else {
				let thumbStream = await F.get(`https://i.pximg.net/c/150x150/img-master/img/${raw.time}/${raw.iid}${~~raw.ugoira ? '' : '_p0'}_master1200.jpg`, 2);
				let cacheStream = _fs.createWriteStream(path);

				await new Promise(function(resolve) {
					cacheStream.on('finish', function() {
						set(iid, true);

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