module.exports = {
	m: async function(raw, db) {
		try {
			let coll = db.coll('illust');

			let result = await E.picov.W.listSearch(raw.page);

			let stats = await coll.getStat(result);

			for(let illust of result) {
				let stat = stats[illust.iid];

				if(stat) {
					illust.down = stats[illust.iid].down;
					illust.ding = stats[illust.iid].ding;
				}

				illust.stat1 = '';
				illust.stat2 = '';
			}

			return result;
		}
		catch(e) {
			L(e);

			return { _stat: 3 };
		}
	}
};