module.exports = function(obj, path = '', cb) {
	const paths = path.split('.');

	let now = obj;

	do {
		if(now === null || now === void 0) {
			return void 0;
		}

		now = now[paths.shift()];
	}
	while(paths.length);

	if(typeof cb == 'function') {
		return cb(now);
	}

	return now;
};