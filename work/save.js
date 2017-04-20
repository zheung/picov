let head = async(iid, time, pid, ext = 'png') => {
		let url = `http://i.pximg.net/img-original/img/${time}/${iid}_p${pid}.${ext}`, code = await func.head(url);

		if(code == 200)
			return [url, pid];
		else if(code == 404 && ext == 'png')
			return await head(iid, time, pid, 'jpg');
		else if(typeof code != 'number') {
			log(code);

			return false;
		}
	},
	down = async(url, iid, now, pid) => {
		try {
			let getStream = await func.get(url[0], 2, false);

			await new Promise((resolve) => {
				if(getStream && getStream.pipe) {
					getStream.pipe(
						fs.createWriteStream(`save/${iid}_p${url[1]}.png`)
						.on('finish', () => {
							log('下载', iid, `(${now}/${pid})`, '完毕');

							resolve();
						})
					);
				}
			});
		} catch (err) {
			log(err);
		}
	};

module.exports = async(iid, time) => {
	let pid = 0, urls = [], url;

	while((url = await head(iid, time, pid++)))
		urls.push(url);

	log('下载', iid, `共${--pid}张`);

	await Promise.mapSeries(urls, (url, now) => {
		return down(url, iid, now+1, pid);
	});

	return pid;
};