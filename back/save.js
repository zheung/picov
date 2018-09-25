let counted = { ding: 0, down: 0, fail: 0 };
WC.add('save-count', counted);

let down = async function(url, pid, pstat, iid, ext) {
	try {
		++counted.ding;
		pstat.strt = true;
		pstat.ding = true;

		let getStream = await F.get(url, 2, false);

		await new Promise(function(resolve, reject) {
			try {
				let total;
				let passed = 0;
				let fileName = `${iid}_p${pid}.${ext}`;
				let tempPath = J(C.C.path.cache, 'large', fileName);

				_fs.removeSync(tempPath);

				let writeStream = _fs.createWriteStream(tempPath)
					.on('drain', function() {
						getStream.resume();
					})
					.on('finish', function() {
						pstat.ding = false;
						pstat.down = true;

						_fs.moveSync(tempPath, J(C.C.path.large, fileName), { overwrite: true });

						resolve();
					})
					.on('error', function(error) {
						reject(error);
					});

				if(getStream && getStream.pipe) {
					getStream
					.on('error', function(err) {
						reject(err);
					})
					.on('response', function(res) {
						total = ~~res.headers['content-length'];
					})
					.on('data', function(chunk) {
						passed += chunk.length;

						if(writeStream.write(chunk) == false)
							getStream.pause();

						pstat.percent = Math.round(passed * 100 / total);
					})
					.on('end', function() {
						writeStream.end();
					});
				}
			} catch (error) {
				LE(error);
			}
		});

		return true;
	} catch (err) {
		L(err);

		return false;
	}
};

let downMap = async function(urls, stat, iid, ext, item, coll) {
	item.ding = true;
	await coll.updateOne(item);

	await Bluebird.map(urls, async function(info) {
		let time = 0;
		let retry = ~~C.C.retry;

		let url = info[0];
		let pid = info[1];

		let pstat = stat.map[pid] = {
			pid: info[1],

			strt: false,
			ding: false,
			down: false,

			percent: 0
		};

		while(!await down(url, pid, pstat, iid, ext) && time++ <= retry) {
			--counted.ding;

			stat.retry = time;
		}

		if(time > retry) {
			++counted.fail;
		}
		else {
			++counted.down;
		}
	});

	item.ding = false;
	item.down = true;
	await coll.updateOne(item);
};

module.exports = {
	m: async function(option, db) {
		try {
			let iid = option.iid;
			let force = option.force;

			let coll = db.coll('illust');

			let item = await coll.getStatOne(iid);

			if(force) {
				item.ding = false;
				item.down = false;
			}
			else {
				if(item.ding) {
					return '正在下载';
				}
				else if(item.down) {
					return '已经下载';
				}
			}

			let stat = {
				iid,

				head: false,
				count: -1,

				retry: 0,

				map: []
			};

			WC.add(`save-${iid}`, stat);

			let info = JSON.parse(await F.get(`https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=${iid}`, 3));

			let count = ~~info.body[iid].illust_page_count;
			let ext = info.body[iid].illust_ext;
			let time = info.body[iid].url.big.match(/(\d{4}\/)(\d{2}\/){4}(\d{2})/g)[0];

			stat.count = count || 0;
			stat.ext = ext;
			stat.time = time;
			stat.head = true;

			let urls = [];
			let pcount = 0;
			while(pcount < count) {
				urls.push([`https://i.pximg.net/img-original/img/${time}/${iid}_p${pcount}.${ext}`, pcount++]);
			}

			downMap(urls, stat, iid, ext, item, coll);

			return '准备下载';
		}
		catch(e) {
			L(e);

			return { _stat: 3 };
		}
	}
};