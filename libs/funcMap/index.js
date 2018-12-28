module.exports = async function($, path, map = {}) {
	let enumFlow = await require('./enum')($);

	map._find = (await require('./find')($)).bind(map);

	await enumFlow(path, map);

	return map;
};