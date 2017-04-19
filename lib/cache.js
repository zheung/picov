module.exports = async() => {
	let list = fs.readdirSync('./cache'), dict = {};

	list.map((file) => {
		dict[file.split('.')[0]] = true;
	});

	return {
		has: async(iid) => {
			return dict[iid];
		},
		set: async(iid, type = true) => {
			dict[iid] = type;
		}
	};
};