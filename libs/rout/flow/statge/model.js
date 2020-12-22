const PA = require('path');
const DB = require('../../../postgres')(require(PA.resolve(__main.dir, '.auth')));

module.exports = function(model) {
	if(typeof model !== 'function') {
		return false;
	}

	return async function(flow) {
		const { raw, ctx } = flow;

		const option = flow.option;

		let conn;

		try {
			conn = await DB.pick();

			flow.result = await model.bind(ctx)(option, conn, conn.query, conn.format, raw);
		}
		finally {
			if(conn) { conn.close(); }
		}
	};
};