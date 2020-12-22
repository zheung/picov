const Profile = require('../../../libs/profile');

const optchain = require('../../../tools/optchain');
const { getJSON } = require('../api.api');

const formatItem = function(item) {
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

module.exports = function() {
	return {
		async c(raw) {
			const P = Profile(raw.who);

			const data = await getJSON(`https://www.pixiv.net/touch/ajax/follow/latest?type=illusts&p=${raw.page || 1}`, P.cookie);

			return optchain(data, 'body.illusts', r => r.map(item => formatItem(item)));
		},
		async m(list, conn, query) {
			let illusts = [];
			let files = [];

			if(list.length) {
				illusts = await query('SELECT * FROM pixiv.illust WHERE id IN ($r)', [list.map(r => r.iid)]);
				files = await query('SELECT * FROM pixiv.file WHERE illust IN ($r)', [list.map(r => r.iid)]);
			}

			return [list, illusts, files];
		},
		r([list, illusts, files]) {
			for(const illust of list) {
				const illustSaved = illusts.find(s => s.id == illust.iid);

				if(illustSaved) {
					illust.down = !!(illustSaved.stat & 1);
					illust.ding = !!(illustSaved.stat & 2);

					illust.downCount = illustSaved.down ? illust.count : 0;

					illust.files = files
						.filter(file => file.illust == illustSaved.id)
						.sort((a, b) => a.index - b.index)
						.map(file => { return { delay: file.delay, file: file.name }; });
				}
				else {
					illust.downCount = 0;
				}
			}

			// return list.filter(illust => CC.block.user.indexOf(illust.uid) == -1);
			return list;
		}
	};
};