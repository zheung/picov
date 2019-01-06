module.exports = function($) {
	let { A, DB } = $;

	return async function(raw) {
		let coll = DB.coll('illust');

		let result = await A.touch.listAuthor(raw);

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
	};
};