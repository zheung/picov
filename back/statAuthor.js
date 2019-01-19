module.exports = function({ A }) {
	return async function(raw) {
		return await A.touch.statAuthor(raw);
	};
};