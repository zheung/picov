module.exports = function({ A, T, BM, CC }) {
	let modes = ['follow', 'author', 'search'];

	return {
		async c(raw) {
			if(raw.mode == 'list') {
				return raw.list;
			}
			else if(modes.indexOf(raw.listMode) + 1) {

				return await A.touch[`list${raw.listMode.replace(/^./, str => str.toUpperCase())}`](raw);
			}

			throw '缺少对应的[模式]';
		},
		async m(list, conn, query) {
			let illusts = await query('SELECT * FROM pixiv.illust WHERE id IN ($r)', [list.map(r => r.iid)]);
			let files = await query('SELECT * FROM pixiv.file WHERE illust IN ($r)', [list.map(r => r.iid)]);

			T.util.toBets(illusts, BM.illust);

			return [list, illusts, files];
		},
		r([list, illusts, files]) {
			for(let illust of list) {
				let illustSaved = illusts.find(s => s.id == illust.iid);

				if(illustSaved) {
					illust.down = !!illustSaved._stat.down;
					illust.ding = !!illustSaved._stat.ding;

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

			return list.filter(illust => CC.block.user.indexOf(illust.uid) == -1);
		}
	};
};