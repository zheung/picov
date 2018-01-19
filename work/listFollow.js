module.exports = async (page) => {
	return new Promise(async resolve => {
		let buf = await func.get(`http://www.pixiv.net/bookmark_new_illust.php?p=${page || 1}`, 1),
			str = buf.toString();

		let take = (err, window) => {
			let $ = window.$, result = [];

			let items = $('li.image-item');

			try {
				if(items.length) {
					items.each(function() {
						let $$ = $(this), img = $$.find('img._thumbnail');

						result.push({
							iid: img.data('id'),
							title: $$.find('h1.title').attr('title'),
							uid: img.data('userId'),
							user: $$.find('a.user').data('user_name'),
							tags: img.data('tags').split(' '),
							time: img.data('src').match(/(\d{4}\/)(\d{2}\/){4}(\d{2})/g)[0],
							type: img.data('type'),
							multi: $$.find('a._work').hasClass('multiple') ? 1 : 0,
							ugoira: $$.find('a._work').hasClass('ugoku-illust')? 1 : 0
						});
					});
				}
				else {
					let items = $('div#js-mount-point-latest-following').data().items;

					for(let item of items)
						result.push({
							iid: item.illustId,
							title: item.illustTitle,
							uid: item.userId,
							user: item.userName,
							tags: item.tags,
							time: item.url.match(/(\d{4}\/)(\d{2}\/){4}(\d{2})/g)[0],
							type: ['illust', '', 'ugoria'][~~item.illustType],
							multi: ~~item.pageCount > 1 ? 1 : 0,
							ugoira: ~~item.illustType == 2 ? 1 : 0,
						});
				}
			}
			catch(e) { L(e); }

			resolve(result);
		};

		jsdom.env(str, ['./asset/js/jquery.js'], take);
	});
};