module.exports = async function(dbinfo) {
	let mysql = require('mysql');
// 连接池
	let pool = mysql.createPool(dbinfo);

	return {
	// 获取连接
		pick: async function() {
			let conn = await (new Promise(function(resolve, reject) {
				pool.getConnection(function(err, result) {
					if(err) {
						reject(err);
					}
					else {
						resolve(result);
					}
				});
			}));

		// 连接方法封装
			let connWrapper = {
				_conn: conn,

				query: async function() {
					let sql = mysql.format.apply(mysql, arguments);

					return new Promise(function(resolve, reject) {
						conn.query(sql, function(err, result) {
							if(err) {
								reject(err);
							}
							else {
								resolve(result);
							}
						});
					});
				},
				queryOne: async function() {
					let sql = mysql.format.apply(mysql, arguments);

					return new Promise(function(resolve, reject) {
						conn.query(sql, function(err, result) {
							if(err) {
								reject(err);
							}
							else {
								resolve(result[0]);
							}
						});
					});
				},

				format: function() {
					return mysql.format.apply(mysql, arguments);
				},

				close: function() {
					return conn.release();
				},

				trans: async function() {
					return new Promise(function(resolve, reject) {
						conn.beginTransaction(function(err, result) {
							if(err) {
								reject(err);
							}
							else {
								resolve(result);
							}
						});
					});
				},
				commit: async function() {
					return new Promise(function(resolve, reject) {
						conn.commit(function(err, result) {
							if(err) {
								reject(err);
							}
							else {
								resolve(result);
							}
						});
					});
				},
				rollback: async function() {
					return new Promise(function(resolve, reject) {
						conn.rollback(function(err, result) {
							if(err) {
								reject(err);
							}
							else {
								resolve(result);
							}
						});
					});
				}
			};

			return connWrapper;
		},
		queryOnce: async function() {
			let sql = mysql.format.apply(mysql, arguments);

			return await (new Promise(function(resolve, reject) {
				pool.query(sql, function(err, result) {
					if(err) {
						reject(err);
					}
					else {
						resolve(result);
					}
				});
			}));
		},
		queryOne: async function() {
			let sql = mysql.format.apply(mysql, arguments);

			return await (new Promise(function(resolve, reject) {
				pool.query(sql, function(err, result) {
					if(err) {
						reject(err);
					}
					else {
						resolve(result[0]);
					}
				});
			}));
		},
		format: function() {
			return mysql.format.apply(mysql, arguments);
		}
	};
};