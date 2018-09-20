module.exports = {
	c: async function(raw) {
		let type = raw.types;

		if(type && typeof type == 'string') {
			return WC.lst(raw.types.split(';'));
		}
		else {
			return { _stat: 2 };
		}
	}
};