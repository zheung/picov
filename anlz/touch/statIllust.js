module.exports = function({ T }) {
	return async function(iid) {
		try {
			let item = (await T('get')(`https://www.pixiv.net/touch/ajax/illust/details?illust_id=${iid}`, 4)).illust_details;

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
		}
		catch(error) {
			return null;
		}
	};
};