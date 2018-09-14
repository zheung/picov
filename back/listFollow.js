module.exports = {
	m: async function(raw, db) {
		try {
			let coll = db.coll('illust');

			let result = await W.listFollow(raw.page);

			let stats = await coll.getStat(result);

			for(let illust of result) {
				let stat = stats[illust.iid];

				if(stat) {
					illust.down = stats[illust.iid].down;
					illust.ding = stats[illust.iid].ding;
				}
			}

			return result;
		}
		catch(e) {
			L(e);

			return { _stat: 3 };
		}
	}
};