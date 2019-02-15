module.exports = function($) {
	let { A, DB } = $;

	return async function(raw) {
		let coll = DB.coll('illust');

		let result = await A.touch.listFollow(raw);

		let stats = await coll.getStat(result);

		for(let illust of result) {
			let stat = stats[illust.iid];

			if(stat) {
				illust.down = stat.down;
				illust.ding = stat.ding;
				illust.frames = stat.frames;
				illust.urls = stat.urls;
				illust.downCount = stat.down ? illust.count : 0 ;
			}
			else {
				illust.downCount = 0;
			}
		}

		return result;
	};
};