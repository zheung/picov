let down = async(url, iid, proc, socket, ts) => {
		try {
			let getStream = await func.get(url[0], 2, false);

			await new Promise((resolve) => {
				let writeStream = fs.createWriteStream(`save/${iid}_p${url[1]}.png`), total;

				if(getStream && getStream.pipe) {
					getStream
					.on('response', (res) => {
						total = res['content-length'];
					})
					.on('data', (chunk) => {
						passedLength += chunk.length;

						if(writeStream.write(chunk) === false) {
							readStream.pause();
						}
						// rog(socket, ts, '下载', iid, proc, chunk);
					})
				readStream.on('end', function() {
				writeStream.end();
				});
				writeStream.on('drain', function() {
				readStream.resume();
				});
					// .pipe(

					// 	.on('finish', () => {
					// 		rog(socket, ts, '下载', iid, proc, '完毕');

					// 		resolve();
					// 	})
					// )
					;
				}
			});

			return true;
		} catch (err) {
			log(err);

			return false;
		}
	};

module.exports = async(iid, time, socket) => {
	let info = JSON.parse((await func.get(`https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=${iid}`, 1)).toString()),
		urls = [], pid = 0, count = ~~info.body[iid].illust_page_count, ext = info.body[iid].illust_ext;

	while(pid < count)
		urls.push([`http://i.pximg.net/img-original/img/${time}/${iid}_p${pid}.${ext}`, pid++]);

	sog(socket, '下载', iid, `共${count}张`);

	await Promise.mapSeries(urls, async(url, now) => {
		let tid = 0, proc = `(${now+1}/${pid})`, retry = ~~conf.retry, ts = new Date().getTime();

		rog(socket, ts, '下载', iid, proc);

		while(!await down(url, iid, proc, socket, ts) && tid++ <= retry)
			rog(socket, ts, '下载', iid, proc, '失败', `第(${tid}/${retry})次重试`);
	});

	return pid;
};