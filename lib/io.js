module.exports = (socket) => {
	socket.on('list', async(query) => {
		let result;

		try {
			result = { s: true, now: ~~query.p, mean: '关注的作品', records: await work.list(query.p) } ;
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