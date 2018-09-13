let U = T('util');

module.exports = {
	c: async function(raw) {
		if(!raw.cols) {
			raw.cols = 'dict_value, dict_text';
		}

		raw.select = U.parseSelect(raw.cols);
	},
	m: async function(option, conn, query, format) {
		let sql = `SELECT ${option.select} FROM t_web_dict WHERE 1=1`;

		if(option.type) {
			sql += format(' AND dict_type = ?', [option.type]);
		}

		return await query(sql);
	},
	r: async function(result, raw) {
		if(raw.top) {
			try {
				raw.top = JSON.parse(raw.top);
			}
			finally {
				result.unshift(raw.top);
			}
		}
	}
};