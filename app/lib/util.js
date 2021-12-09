let util = {
	// JSON String-->Object
	toData: function(objs, key = 'row_data', delRaw = true) {
		for(let obj of objs) {
			try {
				obj[key] = JSON.parse(obj.row_data || '{}');
			}
			catch(error) {
				obj[key] = {};
				obj._rowDataError = true;
			}

			if(delRaw) {
				delete obj.row_data;
			}
		}
	},

	// BitSet-->Number
	foBet: function(obj, bitMap = {}, setKey = '_stat', numKey = 'row_stat', delSet = true) {
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
	toBet: function(obj, bitMap = {}, setKey = '_stat', numKey = 'row_stat') {
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
	toBetBatch: function(arr, bitMap, setKey = '_stat', numKey = 'row_stat') {
		for(let obj of arr) {
			util.toBet(obj, bitMap, setKey, numKey);
		}

		return arr;
	},

	// 用于加密处理(原设备管理平台加密)
	encrypt: async function(text, keys, ivs, algorithm) {
		let iv = new Buffer(ivs ? ivs : 0);
		let key = new Buffer(keys);

		let cipher = _cr.createCipheriv(algorithm.ecb, key, iv);
		cipher.setAutoPadding(true);

		let ciph = cipher.update(text, 'utf8', 'base64');

		ciph += cipher.final('base64');

		return ciph;
	},

	numIn: function(num_, left_, right_) {
		let num = parseFloat(num_);
		let left = parseFloat(left_);
		let right = parseFloat(right_);

		if(
			!isNaN(num) &&
			!isNaN(left) &&
			!isNaN(right) &&
			num >= left &&
			num <= right
		) {
			return true;
		}

		return false;
	},

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

	// select列生成
	parseSelect: function(cols, prefix) {
		if(util.isStr(cols)) {
			cols = cols.split(',');
		}

		if(!util.isArray(cols)) { return ''; }

		let text = '';

		for(let col of cols) {
			if(prefix) {
				text += prefix;
				text += '.';
			}

			if(col.indexOf(':') + 1) {
				col = col.split(':');

				text += col[0].trim();
				text += ' AS ';
				text += col[1].trim();
			}
			else {
				text += col.trim();
			}

			text += ', ';
		}

		return text.replace(/, $/, '');
	}
};

export default util;