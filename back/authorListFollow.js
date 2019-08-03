module.exports = function($) {
	let { A } = $;

	return async function(raw) {
		return A.touch.authorListFollow(raw);
	};
};