module.exports = async function($) {
	_fs.ensureDirSync(JD('..', $.conf.path.large));
	_fs.ensureDirSync(JD('..', $.conf.path.cache, 'large'));
	_fs.ensureDirSync(JD('..', $.conf.path.cache, 'thumb'));

	global.func = {
		get: require('./func/get'),
		head: require('./func/head')
	},

	global.work = {
		listFollow: require('./work/listFollow'),
		listSearch: require('./work/listSearch'),
		listAuthor: require('./work/listAuthor'),
		thumb: require('./work/thumb'),
		save: require('./work/save')
	};

	global.cache = await require('./lib/cache')();
};