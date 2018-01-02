let dictDown = global.dictDown, dictDing = global.dictDing;

module.exports = (socket) => {
	socket.on('listFollow', async(query) => {
		let result;

		try {
			result = {
				s: true,
				now: ~~query.p,
				mean: '关注的作品',
				records: await work.listFollow(query.p)
			};

			result.records.map((r) => {
				r.down = !!dictDown[r.iid];
				r.ding = !!dictDing[r.iid];
			});
		}
		catch(e) {
			L(e);

			result = { s: false };
		}

		socket.emit('list', result);
	});

	socket.on('listSearch', async(query) => {
		let result;

		try {
			result = {
				s: true,
				now: ~~query.p,
				mean: `关键词：${query.w}`,
				records: await work.listSearch(query.w, query.p, query.l)
			};

			result.records.map((r) => {
				r.down = !!dictDown[r.iid];
				r.ding = !!dictDing[r.iid];
			});
		}
		catch(e) {
			L(e);

			result = { s: false };
		}
		socket.emit('list', result);
	});

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

			result.records.map((r) => {
				r.down = !!dictDown[r.iid];
				r.ding = !!dictDing[r.iid];
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

		if(dictDing[iid])
			sog.l('拒绝', iid, '正在下载');
		else if(dictDown[iid])
			sog.l('拒绝', iid, '已经下载');
		else {
			socket.emit('save', iid, dictDown[iid], (dictDing[iid] = true));

			fs.writeFileSync('./dictDing.json', JSON.stringify(dictDing));

			await work.save(iid, sog);

			fs.writeFileSync('./dictDown.json', JSON.stringify(dictDown));

			delete dictDing[iid];

			socket.emit('save', iid, (dictDown[iid] = true), !!dictDing[iid]);

			fs.writeFileSync('./dictDing.json', JSON.stringify(dictDing));
		}
	};

	socket.on('save', save);
};