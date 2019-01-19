module.exports = function($) {
	let { T, JsDom } = $;

	return async function(page) {
		return new Promise(async function(resolve, reject) {
			try {
				let buf = await T('get')(`https://www.pixiv.net/bookmark_new_illust.php?p=${page || 1}`, 1);
				let str = buf.toString();

				let take = function(err, window) {
					let $ = window.$, result = [];

					try {
						let items = $('div#js-mount-point-latest-following').data().items;

						for(let item of items) {
							result.push({
								iid: item.illustId,
								title: item.illustTitle,
								uid: item.userId,
								user: item.userName,
								tags: item.tags,
								time: item.url.match(/20(\d{2}\/){5}(\d{2})/g)[0],
								type: ~~item.illustType,
								count: ~~item.pageCount
							});
						}
					}
					catch(e) { L(e); }

					resolve(result);
				};

				JsDom.env(str, ['./libs/jquery.js'], take);
			} catch (error) {
				reject(error);
			}
		});
	};
};