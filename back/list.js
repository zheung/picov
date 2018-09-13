
module.exports = {
	m: async function(raw, db) {
		let result;

		let coll = db.coll('illust');

		try {
			result = {
				s: true,
				now: ~~raw.p,
				mean: '关注的作品',
				records: await work.listFollow(raw.p)
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
	},
};