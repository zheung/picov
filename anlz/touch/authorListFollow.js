module.exports = function({ T }) {
	let formatItem = function(item) {
		return {
			uid: ~~item.user_id,
			user: item.user_name,
			account: item.user_account,
			head: item.profile_img.main,
			stat: ~~item.user_status,
			comment: item.user_comment
		};
	};

	return async function({ page = 1 }) {
		let raw = await T.get(`https://www.pixiv.net/touch/ajax/user/related?id=8490049&type=user&&p=${page}`, 4);

		let result = [];

		for(let item of raw.related) {
			result.push(formatItem(item));
		}

		return result;
	};
};