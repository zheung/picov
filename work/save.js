let countProc = 0;

let down = async(url, iid, proc, ext, ts, sog) => {
	try {
		let getStream = await func.get(url[0], 2, false);

		sog.rf('CountProc', '下载中的作品：', ++countProc);

		await new Promise((resolve, reject) => {
			let total;
			let passed = 0;
			let fileName = `${iid}_p${url[1]}.${ext}`;
			let tempPath = path.join(conf.path.cache, 'large', fileName);

			fs.removeSync(tempPath);

			let writeStream = fs.createWriteStream(tempPath)
				.on('drain', () => {
					getStream.resume();
				})
				.on('finish', () => {
					sog.r(ts, '下载', iid, proc, '完成');

					fs.moveSync(tempPath, path.join(conf.path.large, fileName), { overwrite: true });

					sog.rf('CountProc', '下载中的作品：', --countProc);

					resolve();
				});

			if(getStream && getStream.pipe)
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

					sog.rc(ts, 'white', '下载', iid, proc, Math.round(passed * 100 / total)+'%');
				})
				.on('end', () => {
					writeStream.end();
				});
		});

		return true;
	} catch (err) {
		L(err);

		return false;
	}
};

module.exports = async(iid, sog) => {
	let tsMeta = `${new Date().getTime()}${iid}`;

	sog.r(tsMeta, '下载', iid, '抓取元信息');

	let info = JSON.parse(await func.get(`https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=${iid}`, 3)),
		urls = [], pid = 0, count = ~~info.body[iid].illust_page_count, ext = info.body[iid].illust_ext,
		time = info.body[iid].url.big.match(/(\d{4}\/)(\d{2}\/){4}(\d{2})/g)[0];

	sog.rl(tsMeta, '下载', iid, `共${count}张`, info.body[iid].illust_title);

	while(pid < count)
		urls.push([`http://i.pximg.net/img-original/img/${time}/${iid}_p${pid}.${ext}`, pid++]);

	await Promise.map(urls, async(url, now) => {
		let tid = 0, proc = `(${now+1}/${pid})`, retry = ~~conf.retry, tsProc = `${new Date().getTime()}${url[1]}`;

		sog.rc(tsProc, 'white', '下载', iid, proc);

		while(!await down(url, iid, proc, ext, tsProc, sog) && tid++ <= retry) {
			sog.rf('CountProc', '下载中的作品：', --countProc);

			sog.ll('下载', iid, proc, '失败', `第(${tid}/${retry})次重试`);
		}
	});
};