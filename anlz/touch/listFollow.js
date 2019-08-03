module.exports = function({ T }) {
	let formatItem = function(item) {
		return {
			iid: ~~item.id,
			title: item.title,
			uid: ~~item.author_details.user_id,
			user: item.author_details.user_name,
			tags: item.tags,
			time: item.url_s.match(/20(\d{2}\/){5}(\d{2})/g)[0],
			type: ~~item.type,
			count: ~~item.page_count
		};
	};

	return async function({ page=1 }) {
		let odd = await T.get(`https://www.pixiv.net/touch/ajax/follow/latest?type=illusts&p=${page}`, 4);

		let result = [];

		for(let item of odd.body.illusts) {
			result.push(formatItem(item));
		}

		return result;
	};
};