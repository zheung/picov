module.exports = function() {
	return function(path = '') {
		let pathArr = path.split('.');

		let now = this;

		for(let key of pathArr) {
			now = now[key];

			if(!now) {
				return now;
			}
		}

		return now;
	};
};