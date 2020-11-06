// 基本类型格式化
const baseFormat = function baseFormat(match, type = typeof match, wild) {
	if(type == 'number' || type == 'bigint') {
		return match;
	}
	else if(type == 'string') {
		return `'${match.replace(/'/g, '\'\'')}'`;
	}
	else if(type == 'boolean') {
		return match.toString().toUpperCase();
	}
	else if(match == null) {
		return 'NULL';
	}
	else if(match instanceof Array) {
		match = match.map(function(m) { return baseFormat(m); }).join(', ');

		// 数据数组格式
		if(wild != '$r') {
			if(match.length) {
				return `ARRAY[${match}]`;
			}
			else {
				return '\'{}\'';
			}
		}

		return match;
	}

	throw `格式化 [SQL]: 错误, [匹配数据]类型{${type}}不支持`;
};

// Number|Bigint  : 1 ==> 1
// String         : `a` ==> `a`
// String with $$ : `a` ==> "a"
// Boolean        : true ==> TRUE
// Null           : null ==> NULL
// Array          : [1, `a`, true] ==> ARRAY[1, `a`, TRUE]
// Array with $r  : [1, `a`, true] ==> 1, `a`, TRUE
// Object         : { a: 1, b: `a` } ==> a=1, b=`a`
// Object with $i : { a: 1, b: `a` } ==> (a, b) VALUES (1, `a`)
const format = function format(sql, param = []) {
	let index = 0;
	let result = sql.replace(/\$(r|i|\$+)?/g, (wild, idx) => {
		let match = param[index++];
		let type = typeof match;

		// 通配符长度错误
		if(wild.length > 3) {
			throw `格式化 [SQL]: 错误, 匹配到长度为${wild.length}的通配符, 无法断定`;
		}

		// 检查特殊通配符
		if(wild == '$i' && type != 'object') {
			throw `格式化 [SQL]: 错误, 特殊通配符 $i 匹配类型应为[object], 实际为[${type}]`;
		}
		else if(wild == '$r' && !(match instanceof Array)) {
			throw `格式化 [SQL]: 错误, 特殊通配符 $r 匹配类型应为[object|Array], 实际为[${type}]`;
		}

		try {
			// undefined不匹配
			if(match === undefined) { return wild; }

			let resultMatch;

			// $$处理
			let isSystem = wild == '$$' && type == 'string';
			if(isSystem && type != 'string') {
				G.warn(`数据`, '格式化 [SQL]', `系统通配符 $$ 匹配类型应为[string], 实际为[${type}]`);
			}

			if(type == 'object' && !(match instanceof Array)) {
				let entries = [];

				for(let mkey in match) {
					entries.push([mkey, match[mkey]]);
				}

				// 对象
				resultMatch = entries.map(function(arr) {
					return `"${arr[0]}"=${baseFormat(arr[1])}`;
				}).join(', ');

				// 插入用格式
				if(wild == '$i') {
					let keys = [];
					let vals = [];

					entries.forEach(function(arr) {
						let a = arr[0];
						let b = arr[1];

						let aType = typeof a;

						if(aType != 'string') {
							G.warn(`数据`, '格式化 [SQL]', `系统通配符 $$ [匹配数据]类型应为[string], 实际为${type}`);
						}

						keys.push(`"${a}"`);
						vals.push(baseFormat(b));
					});

					resultMatch = `(${keys.join(', ')})VALUES(${vals.join(', ')})`;
				}
			}
			else {
				// 基本类型
				resultMatch = baseFormat(match, type, wild);
			}

			return isSystem ? `"${match}"` : resultMatch;
		}
		catch(error) {
			if(typeof error == 'string') {
				throw `${error}, 位置{${idx}}`;
			}
			else {
				throw error;
			}
		}
	});

	return result;
};

const parseResult = function parseResult(result) {
	if(result.command == 'INSERT' || result.command == 'UPDATE' || result.command == 'DELETE') {
		if(result.rows.length) {
			return result.rows;
		}
		else {
			return result.rowCount;
		}
	}
	else if(result.command == 'SELECT') {
		return result.rows;
	}
	else {
		return result;
	}
};

module.exports = function(auth) {
	const { Pool } = require('pg');

	const pool = new Pool({
		host: auth.dest,
		port: auth.port,
		user: auth.user,
		password: auth.pswd,
		database: auth.name,
	});

	delete auth.dest;
	delete auth.port;
	delete auth.user;
	delete auth.pswd;
	delete auth.name;

	pool.query('SHOW CLIENT_ENCODING')
		.then(r => G.debug('数据', `测试 [数据库连接], 客户端编码{${r.rows[0].client_encoding}}`));

	return {
		async pick() {
			const client = await pool.connect();

			// 连接方法封装
			let connWrapper = {
				_conn: client,

				async query() {
					let sql = format(...arguments);
					let result = await client.query(sql);

					return parseResult(result);
				},
				async queryOne() {
					let sql = format(...arguments);
					let result = await client.query(sql);

					return parseResult(result)[0];
				},

				format: format,

				close() {
					return client.release();
				},

				async trans() {
					return await client.query('BEGIN');
				},
				async commit() {
					return await client.query('COMMIT');
				},
				async rollback() {
					return await client.query('ROLLBACK');
				}
			};

			return connWrapper;
		},
		async queryOnce() {
			let sql = format(...arguments);
			let result = await pool.query(sql);

			return parseResult(result);
		},
		async queryOne() {
			let sql = format(...arguments);
			let result = await pool.query(sql);

			return parseResult(result);
		},

		format: format,
	};
};