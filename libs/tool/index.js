module.exports = function($) {
	return function(nameTool) {
		return require('./'+nameTool)($);
	};
};