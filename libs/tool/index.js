module.exports = function($) {
	return {
		get: require('./get')($),
		util: require('./util')($),
		dap: require('./dirMap')($),
		epost: require('./epost')($)
	};
};