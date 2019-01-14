module.exports = function($) {
	let { G, C, T, Bluebird, DB } = $;

	let { EventEmitter } = require('ws');

	let fse = require('fs-extra');

	let counted = { ding: 0, down: 0, fail: 0 };

	let down = async function(url, pid, pstat, iid, ext, wock) {
		try {
			++counted.ding;

			let getStream = (await T('get')(url, 2))
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
					let fileName = `${iid}_p${pid}.${ext}`;
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
						})
						.on('error', function(error) {
							reject(error);
						});

					getStream.pipe(saveStream);
				} catch (error) {
					G.error(error);
				}
			});

			return true;
		} catch (err) {
			G.error(err.message);

			return false;
		}
	};

	let downMap = async function(urls, iid, ext, item, coll, wock) {
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
					if(pstat.total[pid] > 0){
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

					pstat.totalSum = T('util').formatSize(size);

					wock.cast('stat', iid, 'statL', `下载 ${pstat.count}张[${pstat.totalSum}]`);
				}

				wock.cast('stat', iid, 'statR', Math.round(percent * 100 / pstat.count) +' %');
			}
		};

		await Bluebird.map(urls, async function(info) {
			let times = 0;
			let retryMax = ~~C.retry;

			let url = info[0];
			let pid = info[1];

			while(!await down(url, pid, pstat, iid, ext, wock) && times++ <= retryMax) {
				--counted.ding;
			}

			if(times > retryMax) {
				++counted.fail;
			}
			else {
				++counted.down;
			}
		});

		item.ding = false;
		item.down = true;
		await coll.updateOne(item);
		wock.cast('stat', iid, 'ding', false);
		wock.cast('stat', iid, 'down', true);

		return pstat;
	};

	return async function(option, wock) {
		if(!(wock instanceof EventEmitter) && wock) {
			wock.cast = function() { };
		}

		try {
			let {iid, count, time } = option;
			let force = option.force;

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

			let info = await T('get')(`https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=${iid}`, 4);

			let ext = info.body[iid].illust_ext;

			item.ding = true;
			await coll.updateOne(item);

			wock.cast('stat', iid, 'ding', true);
			wock.cast('stat', iid, 'statL', `下载 ${count}张`);

			let urls = [];
			let pcount = 0;
			while(pcount < count) {
				urls.push([`https://i.pximg.net/img-original/img/${time}/${iid}_p${pcount}.${ext}`, pcount++]);
			}

			let pstat = await downMap(urls, iid, ext, item, coll, wock);

			return wock.cast('stat', iid, 'statL', `完成[${pstat.totalSum}]`) || '完成';
		}
		catch(e) {
			G.error(`下载 [原图]: 错误, ${e.message}`);
		}
	};
};