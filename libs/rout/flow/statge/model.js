const PA = require('path');
const DB = require('../../../postgres')(require(PA.resolve(__main.dir, '.auth')));

module.exports = function(model) {
	if(typeof model !== 'function') {
		return false;
	}

	return async function(ctx) {
		const option = ctx.flow.option;

		let conn;

		try {
			conn = await DB.pick();

			ctx.flow.result = await model(option, conn, conn.query, conn.format, ctx.flow.raw, ctx);
		}
		finally {
			if(conn) { conn.close(); }
		}
	};
};