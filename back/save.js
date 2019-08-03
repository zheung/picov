module.exports = function($) {
	let { G, C, T, Bluebird, DB } = $;

	let { EventEmitter } = require('ws');

	let fse = require('fs-extra');
	let unzip = require('unzip');

	let counted = { ding: 0, down: 0, fail: 0 };

	let down = async function(url, pid, pstat, wock) {
		try {
			++counted.ding;

			let getStream = (await T.get(url, 2, false))
				.on('response', function(res) {
					pstat.total[pid] = ~~res.headers['content-length'];
				})
				.on('data', function(chunk) {
					if(!pstat.passed[pid]) { pstat.passed[pid] = 0; }
					pstat.passed[pid] += chunk.length;

					pstat.calc(wock);
				})
				.on('error', function(error) {
					throw error;
				});

			await new Promise(function(resolve, reject) {
				try {
					let fileName = _pa.parse(url).base;
					let tempPath = R(C.path.cache, 'large', fileName);

					fse.removeSync(tempPath);

					let saveStream = _fs.createWriteStream(tempPath)
						.on('close', function() {
							try {
								fse.moveSync(tempPath, R(C.path.large, fileName), { overwrite: true });
							}
							catch(error) {
								reject(error);
							}

							resolve();

							pstat.done();
						})
						.on('error', function(error) {
							reject(error);
						});

					getStream.pipe(saveStream);
				} catch(error) {
					G.error(error);
				}
			});

			return true;
		} catch(err) {
			G.error(err.message);

			return false;
		}
	};

	let downMap = async function(urls, iid, item, coll, wock) {
		let pstat = {
			count: urls.length,

			sizePost: false,

			total: {},
			passed: {},

			totalSum: '',

			calc: function(wock) {
				let percent = 0;
				let ready = 0;

				for(let pid in pstat.passed) {
					if(pstat.total[pid] > 0) {
						percent += (pstat.passed[pid] / pstat.total[pid]);
						ready++;
					}
				}

				if(ready == pstat.count && !pstat.sizePost) {
					pstat.sizePost = true;

					let size = 0;

					for(let pid in pstat.total) {
						size += pstat.total[pid];
					}

					pstat.totalSum = T.util.formatSize(size);

					wock.cast('stat', iid, 'statL', `下载 ${pstat.count}张[${pstat.totalSum}]`);
				}

				wock.cast('stat', iid, 'statR', Math.round(percent * 100 / pstat.count) + ' %');
			},
			done: function() {
				wock.cast('statDone', iid);

			}
		};

		await Bluebird.map(urls, async function(url, pid) {
			let times = 0;
			let retryMax = ~~C.retry;

			while(!await down(url, pid, pstat, wock) && times++ <= retryMax) {
				--counted.ding;
			}

			if(times > retryMax) {
				++counted.fail;
			}
			else {
				++counted.down;
			}
		}, { concurrency: 77 });

		item.ding = false;
		item.down = true;
		await coll.updateOne(item);
		wock.cast('stat', iid, 'ding', false);
		wock.cast('stat', iid, 'down', true);

		return pstat;
	};

	return async function(option, wock) {
		let { iid, count, type, force } = option;

		if(!(wock instanceof EventEmitter) && wock) {
			wock.cast = function() { };
		}

		try {
			let coll = DB.coll('illust');

			let item = await coll.getStatOne(iid);

			if(force) {
				item.ding = false;
				item.down = false;
			}
			else {
				if(item.ding) {
					return wock.cast('stat', iid, 'statL', '在下') || '在下';
				}
				else if(item.down) {
					return wock.cast('stat', iid, 'statL', '已下') || '已下';
				}
			}

			wock.cast('stat', iid, 'statL', '解析');

			let info = (await T.get(`https://www.pixiv.net/touch/ajax/illust/details?illust_id=${iid}`, 4)).body;

			item.ding = true;
			await coll.updateOne(item);

			wock.cast('stat', iid, 'ding', true);
			wock.cast('stat', iid, 'statL', `下载 ${count}张`);

			let urls = [];

			if(type == 2) {
				let meta = await T.get(`https://www.pixiv.net/ajax/illust/${iid}/ugoira_meta`, 4);

				urls.push(meta.body.originalSrc);

				item.frames = meta.body.frames;

				wock.cast('stat', iid, 'frames', item.frames);
			}
			else if(info.illust_details.manga_a) {
				for(let manga of info.illust_details.manga_a) {
					urls.push(manga.url_big);
				}

				item.urls = urls;

				wock.cast('stat', iid, 'urls', item.urls);
			}
			else {
				urls.push(info.illust_details.url_big);

				item.urls = urls;

				wock.cast('stat', iid, 'urls', item.urls);
			}

			let pstat = await downMap(urls, iid, item, coll, wock);

			if(type == 2) {
				try {
					let zipPath = R(C.path.large, _pa.parse(urls[0]).base);

					_fs.createReadStream(zipPath)
						.pipe(unzip.Extract({ path: R(C.path.large, String(iid)) }))
						.on('finish', function() {
							fse.removeSync(zipPath);
						});
				}
				catch(e) {
					G.error(`解压 [动图]: 错误, ${iid}, ${e.message}`);
				}
			}

			return wock.cast('stat', iid, 'statL', `完成[${pstat.totalSum}]`) || '完成';
		}
		catch(e) {
			G.error(`下载 [原图]: 错误, ${iid}, ${e.message}`);
		}
	};
};