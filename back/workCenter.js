module.exports = {
	c: async function(raw) {
		let type = raw.types;
		let dels = raw.dels;

		if(dels && typeof dels == 'string') {
			for(let key of dels.split(';')) {
				WC.del(key);
			}
		}

		if(type && typeof type == 'string') {
			return WC.lst(raw.types.split(';'));
		}

		return 5214;
	}
};