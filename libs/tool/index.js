module.exports = function($) {
	return {
		get: require('./get')($),
		util: require('./util')($)
	};
};