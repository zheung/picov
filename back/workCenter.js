module.exports = {
	c: async function(raw) {
		let type = raw.types;
		let dels = raw.dels;

		if(dels && typeof dels == 'string') {
			for(let key of dels.split(';')) {
				E.picov.WC.del(key);
			}
		}

		if(type && typeof type == 'string') {
			return E.picov.WC.lst(raw.types.split(';'));
		}

		return 5214;
	}
};