let coll = db.coll('illust');

module.exports = (socket) => {
	let listAuthor = async(query) => {
		let result, records;

		try {
			query.i = query.i.replace(/^AI/, '');

			records = await work.listAuthor(query.i, query.p);

			result = {
				s: true,
				now: ~~query.p,
				mean: `作者：${records.name}`,
				records: records
			};

			let stats = await coll.getStat(result.records);

			result.records.map((r) => {
				let stat = stats[r.iid];

				if(stat) {
					r.down = stats[r.iid].down;
					r.ding = stats[r.iid].ding;
				}
			});
		}
		catch(e) {
			L(e);

			result = { s: false };
		}

		return result;
	};

	socket.on('listAuthor', async(query) => { socket.emit('list', await listAuthor(query)); });

	socket.on('listAuthorAll', async(id) => {
		let sog = soger(socket);

		let query = { p: 1, i: id };
		let result = (await listAuthor(query)).records;
		let max = result.count / 20 +1;

		let arr = [];
		for(let r of result) {
			if(!r.ugoira) {
				arr.push(save(r.iid));
			}
		}
		sog.rc(`laa${id}-1`, 'white', `下载第${1}页`);
		await Promise.all(arr);
		sog.rc(`laa${id}-1`, 'white', `下载第${1}页`, '完成');

		for(let i=2; i<=max; i++) {
			query.p = i;

			result = (await listAuthor(query)).records;

			let arr = [];
			for(let r of result) arr.push(save(r.iid));
			sog.rc(`laa${id}-1`, 'white', `下载第${i}页`);
			await Promise.all(arr);
			sog.rc(`laa${id}-1`, 'white', `下载第${i}页`, '完成');
		}
	});

	socket.on('listTag', async() => {
		socket.emit('listTag', conf.tags);
	});
	socket.on('downLog', async(downLog) => {
		socket.downLog = downLog;
	});

	let save = async(query) => {
		let sog = soger(socket), iid = query.iid || query;

		let stat = await coll.getStatOne(iid);

		if(stat.ding)
			sog.l('拒绝', iid, '正在下载');
		else if(stat.down)
			sog.l('拒绝', iid, '已经下载');
		else {
			socket.emit('save', iid, stat.down, (stat.ding = true));

			await coll.updateOne(stat);

			await work.save(iid, sog);

			stat.ding = false;

			await coll.updateOne(stat);

			socket.emit('save', iid, (stat.down = true), !!stat.ding);

			await coll.updateOne(stat);
		}
	};

	socket.on('save', save);
};