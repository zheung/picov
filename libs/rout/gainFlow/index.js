module.exports = async function($) {
	let { C, T } = $;

	let execFlow = await require('./exec')($);
	let wrapFlow = await require('./wrap')($, execFlow);

	return await T.dap(C.path.back, ($.F = {}), wrapFlow);
};