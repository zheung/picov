let util = {
	// 用于后端render转换row_data列的json数据
	parseRowData: function(objs, name) {
		for (let obj of objs) {
			try {
				obj[name || 'row_data'] = JSON.parse(obj.row_data || '{}');
			}
			catch (error) {
				obj[name || 'row_data'] = {};
				obj._rowDataError = true;
			}

			if (name != 'row_data') {
				delete obj.row_data;
			}
		}
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

			if(col.indexOf(':')+1) {
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

module.exports = util;