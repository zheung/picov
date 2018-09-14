module.exports = {
	m: async function(raw, db) {
		let result, records;

		let coll = db.coll('illust');

		try {
			raw.i = raw.i.replace(/^AI/, '');

			records = await W.listAuthor(raw.i, raw.p);

			result = {
				s: true,
				now: ~~raw.p,
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

		return {
			success: true,
			data: result
		};
	}
};