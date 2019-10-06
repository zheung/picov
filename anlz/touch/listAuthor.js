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

	return async function({ uid, page = 1, type = 'all' }) {
		try {
			let odd = await T.get(`https://www.pixiv.net/touch/ajax/user/illusts?p=${page}&id=${uid}&type=${type}`, 4);

			let result = [];

			for(let item of odd.body.illusts) {
				result.push(formatItem(item));
			}

			return result;
		} catch(error) {
			return [];
		}
	};
};