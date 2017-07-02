let dictDown, dictDing = {};
try {
	dictDown = require('../dictDown.json');
}
catch(e) {
	log(e);
	dictDown = {};
}

global.dictDing = dictDing;

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
			log(e);

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
			log(e);

			result = { s: false };
		}
		socket.emit('list', result);
	});

	socket.on('listTag', async() => {
		socket.emit('listTag', conf.tags);
	});

	socket.on('save', async(query) => {
		let sog = soger(socket), iid = query.iid;

		if(dictDing[iid])
			sog.l('拒绝', iid, '正在下载');
		else if(dictDown[iid])
			sog.l('拒绝', iid, '已经下载');
		else {
			socket.emit('save', iid, dictDown[iid], (dictDing[iid] = true));

			await work.save(iid, query.time, sog);

			fs.writeFileSync('./dictDown.json', JSON.stringify(dictDown));

			socket.emit('save', iid, (dictDown[iid] = true), (dictDing[iid] = false));
		}
	});
};