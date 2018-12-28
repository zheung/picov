module.exports = function($) {
	let { A, DB } = $;

	return async function(raw) {
		try {
			let coll = DB.coll('illust');

			let result = await A.listSearch(raw.page);

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
	};
};