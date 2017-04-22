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
				records: await work.listSearch(query.w, query.p)
			};
		}
		catch(e) {
			log(e);

			result = { s: false };
		}

		socket.emit('list', result);
	});

	socket.on('save', async(query) => {
		work.save(query.iid, query.time, soger(socket));
	});
};