module.exports = async (page) => {
	return new Promise(async resolve => {
		let buf = await func.get(`http://www.pixiv.net/bookmark_new_illust.php?p=${page || 1}`, 1),
			str = buf.toString();

		let take = (err, window) => {
			let $ = window.$, result = [];
			$('li.image-item').each(function() {
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

			resolve(result);
		};

		jsdom.env(str, ['./asset/js/jquery.js'], take);
	});
};