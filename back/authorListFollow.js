module.exports = function({ A }) {
	return {
		c(raw) {
			return A.touch.authorListFollow(raw);
		}
	};
};