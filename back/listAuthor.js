module.exports = function($) {
	let { A, DB } = $;

	return async function(raw) {
		let coll = DB.coll('illust');

		let result = await A.touch.listAuthor(raw);

		let stats = await coll.getStat(result);

		for(let illust of result) {
			let stat = stats[illust.iid];

			if(stat) {
				illust.down = stat.down;
				illust.ding = stat.ding;
				illust.frames = stat.frames;
			}
		}

		return result;
	};
};