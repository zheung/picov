let down = async(url, iid, proc, ext, ts, sog) => {
	try {
		let getStream = await func.get(url[0], 2, false);

		await new Promise((resolve, reject) => {
			let total, passed = 0,
				writeStream = fs.createWriteStream(path.join(conf.path.large, `${iid}_p${url[1]}.${ext}`))
				.on('drain', () => {
					getStream.resume();
				})
				.on('finish', () => {
					sog.r(ts, '下载', iid, proc, '完成');

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

					sog.r(ts, '下载', iid, proc, Math.round(passed * 100 / total)+'%');
				})
				.on('end', () => {
					writeStream.end();
				});
		});

		return true;
	} catch (err) {
		log(err);

		return false;
	}
};

module.exports = async(iid, time, sog) => {
	let info = JSON.parse((await func.get(`https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=${iid}`, 1)).toString()),
		urls = [], pid = 0, count = ~~info.body[iid].illust_page_count, ext = info.body[iid].illust_ext;

	while(pid < count)
		urls.push([`http://i.pximg.net/img-original/img/${time}/${iid}_p${pid}.${ext}`, pid++]);

	sog.ll('下载', iid, `共${count}张`);

	await Promise.map(urls, async(url, now) => {
		let tid = 0, proc = `(${now+1}/${pid})`, retry = ~~conf.retry, ts = `${new Date().getTime()}${url[1]}`;

		sog.r(ts, '下载', iid, proc);

		while(!await down(url, iid, proc, ext, ts, sog) && tid++ <= retry)
			sog.ll('下载', iid, proc, '失败', `第(${tid}/${retry})次重试`);
	});

	return pid;
};