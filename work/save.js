let ext = ['png', 'jpg'];

module.exports = async (iid, time) => {
	let found = true, pid = 0;

	while(found) {
		let url, eid = 0;

		while(eid < 2)
			try {
				let test = `http://i.pximg.net/img-original/img/${time}/${iid}_p${pid}.${ext[eid]}`;

				await func.head(test);

				url = test;

				break;
			} catch (err) {
				if(err == 404)
					eid++;
				else if(err.code != 'ETIMEDOUT')
					log(err);
			}

		if(url) {
			log('下载', iid, pid);

			try {
				let thumbStream = await func.get(url, 2, false);

				if(thumbStream && thumbStream.pipe) {
					let saveStream = fs.createWriteStream(`save/${iid}_p${pid}.png`),
						now = pid;

					saveStream.on('finish', () => { log('下载', iid, now, '完毕'); });

					thumbStream.pipe(saveStream);
				}
			} catch (error) {
				log(error);
			}
		}
		else {
			found = false;

			// log('枚举', '完毕', iid, `共${pid}张`);
		}

		pid++;
	}

	return pid;
};