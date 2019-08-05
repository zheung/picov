module.exports = function($) {
	let enumer = require('./enum')($);
	let finder = require('./find')($);

	return async function(path, map = {}, checker) {
		map._find = finder.bind(map);

		await enumer(path, map, path, checker);

		return map;
	};
};