module.exports = function($) {
	let { A } = $;

	return {
		async c(raw) {
			let list = await A.touch.listAuthor(raw);
			let illust = await A.touch.statIllust(raw.uid);

			if(illust) {
				list.unshift(illust);
			}

			return (await $.F.list({
				listMode: 'list',
				list
			})).data;
		}
	};
};