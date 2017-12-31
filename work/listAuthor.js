module.exports = async (id, page) => {
	return new Promise(async resolve => {
		let buf = await func.get(encodeURI(`https://www.pixiv.net/member_illust.php?id=${id}&type=all&p=${page || 1}`), 1),
			str = buf.toString();

		let take = (err, window) => {
			str;
			let $ = window.$, result = [],
				cat1 = $('._image-items>li.image-item'),
				cat2 = $('#js-mount-point-search-result-list').data('items');

			cat1.each(function() {
				let $$ = $(this), img = $$.find('img._thumbnail');
				L(img.data('type'));
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

			if(cat2)
				for(let data of cat2) {
					result.push({
						iid: data.illustId,
						title: data.illustTitle,
						uid: data.userId,
						user: data.userName,
						tags: data.tags,
						time: data.url.match(/(\d{4}\/)(\d{2}\/){4}(\d{2})/g)[0],
						type: ['illust', '', 'ugoria'][~~data.illustType],
						multi: data.pageCount > 1  ? 1 : 0,
						ugoira: data.illustType == 2 ? 1 : 0
					});
				}

			result.name = $('a.user-name').html();
			result.count = $('span.count-badge').html();

			resolve(result);
		};

		jsdom.env(str, ['./asset/js/jquery.js'], take);
	});
};