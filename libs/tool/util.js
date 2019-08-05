let util = {
	// 用于判断变量类型
	isType: function(vari, ins) {
		if(vari && typeof vari == 'object' && vari instanceof ins) {
			return true;
		}
		else {
			return false;
		}
	},

	// 用于判断变量类型
	isObj: function(vari) {
		if(vari && typeof vari == 'object') {
			return true;
		}
		else {
			return false;
		}
	},

	// 判断是否数组
	isArray: function(vari) {
		return util.isType(vari, Array);
	},

	// 判断是否字符串
	isStr: function(vari) {
		if(vari && (typeof vari == 'string' || vari instanceof String)) {
			return true;
		}
		else {
			return false;
		}
	},

	formatSize: function(size) {
		if(size < 1024) {
			return size + ' B';
		}
		else if((size /= 1024) < 1024) {
			return size.toFixed(2) + ' KB';
		}
		else if((size /= 1024) < 1024) {
			return size.toFixed(2) + ' MB';
		}
		else if((size /= 1024) < 1024) {
			return size.toFixed(2) + ' GB';
		}
		else if((size /= 1024) < 1024) {
			return size.toFixed(2) + ' TB';
		}
	},

	// BitSet-->Number
	foBet: function(obj, bitMap = {}, setKey = '_stat', numKey = 'stat', delSet = true) {
		let set = obj[setKey] || {};

		if(typeof set != 'object') { return; }

		let num = obj[numKey] || 0;

		for(let key in bitMap) {
			let stat = parseInt(set[key]);

			if(isNaN(stat)) { continue; }

			let pos = bitMap[key];

			let start = pos - 1;
			let end = pos;

			if(pos instanceof Array) {
				start = pos[0] - 1;
				end = start + pos[1];
			}

			let left = num.toString(2).length - end;

			let mask = parseInt(`${'1'.repeat(left > 0 ? left : 0)}${'0'.repeat(end - start)}${'1'.repeat(start)}`, 2);

			num = (num & mask) | (stat << start);
		}

		obj[numKey] = num;

		if(delSet) {
			delete obj[setKey];
		}

		return obj;
	},

	// Number-->BitSet
	toBet: function(obj, bitMap = {}, setKey = '_stat', numKey = 'stat') {
		let num = obj[numKey] || 0;

		let stats = obj[setKey] = {};

		for(let key in bitMap) {
			let pos = bitMap[key];

			let start = pos - 1;
			let end = pos;

			if(pos instanceof Array) {
				start = pos[0] - 1;
				end = start + pos[1];
			}

			let mask = parseInt(`${'1'.repeat(end - start)}${'0'.repeat(start)}`, 2);

			stats[key] = (num & mask) >> start;
		}

		return obj;
	},

	// Number-->BitSet(批量)
	toBets: function(arr, bitMap, setKey = '_stat', numKey = 'stat') {
		for(let obj of arr) {
			util.toBet(obj, bitMap, setKey, numKey);
		}

		return arr;
	},
};

module.exports = function() {
	return util;
};