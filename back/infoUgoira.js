module.exports = function({ T }) {
	return async function(raw) {
		let meta = (await T('get')(`https://www.pixiv.net/touch/ajax/illust/details?illust_id=${raw.iid}`, 4)).illust_details;

		return {
			user: meta.author_details.user_name,
			uid: meta.author_details.user_id,
			title: meta.title,
			frames: meta.ugoira_meta.frames
		};
	};
};