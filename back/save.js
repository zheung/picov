let counted = { ding: 0, down: 0, fail: 0 };
WC.add('save-count', counted);

let down = async function(url, pid, pstat, iid, ext) {
	try {
		++counted.ding;

		let getStream = await F.get(url, 2, false);

		await new Promise(function(resolve, reject) {
			let total;
			let passed = 0;
			let fileName = `${iid}_p${pid}.${ext}`;
			let tempPath = J(C.C.path.cache, 'large', fileName);

			_fs.removeSync(tempPath);

			let writeStream = _fs.createWriteStream(tempPath)
				.on('drain', () => {
					getStream.resume();
				})
				.on('finish', () => {
					pstat.down = true;

					_fs.moveSync(tempPath, J(C.C.path.large, fileName), { overwrite: true });

					resolve();
				});

			if(getStream && getStream.pipe) {
				getStream
				.on('error', (err) => {
					reject(err);
				})
				.on('response', (res) => {
					total = ~~res.headers['content-length'];
				})
				.on('data', (chunk) => {
					passed += chunk.length;

					if(writeStream.write(chunk) == false)
						getStream.pause();

					pstat.percent = Math.round(passed * 100 / total);
				})
				.on('end', () => {
					writeStream.end();
				});
			}
		});

		return true;
	} catch (err) {
		L(err);

		return false;
	}
};

module.exports = {
	c: async function(raw) {
		return raw.iid;
	},
	m: async function(iid, db) {
		try {
			let stat = {
				iid,

				head: false,
				count: 0,

				retry: 0,

				map: []
			};

			WC.add(`save-${iid}`, stat);

			let info = JSON.parse(await F.get(`https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=${iid}`, 3));

			let count = ~~info.body[iid].illust_page_count;
			let ext = info.body[iid].illust_ext;
			let time = info.body[iid].url.big.match(/(\d{4}\/)(\d{2}\/){4}(\d{2})/g)[0];

			stat.count = count;
			stat.ext = ext;
			stat.time = time;
			stat.head = true;

			let urls = [];
			let pcount = 0;
			while(pcount < count) {
				urls.push([`https://i.pximg.net/img-original/img/${time}/${iid}_p${pcount}.${ext}`, pcount++]);
			}

			urls.map(async function(urlInfo) {
				let time = 0;
				let retry = ~~C.C.retry;

				let url = urlInfo[0];
				let pid = urlInfo[1];

				let pstat = stat.map[pid] = {
					pid: urlInfo[1],

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

			return 1;
		}
		catch(e) {
			L(e);

			return { _stat: 3 };
		}
	}
};