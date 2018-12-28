module.exports = async function() {
	return async function(ctx, next) {
		let raw = ctx.raw || {};

		if(ctx.request && ctx.request.body) {
			for(let key in ctx.request.body) {
				raw[key] = ctx.request.body[key];
			}
		}

		if(ctx.query) {
			for(let key in ctx.query) {
				raw[key] = ctx.query[key];
			}
		}

		raw.token = ctx.cookies.get('token', { signed: true }) || raw.token;
		raw._ip = ctx.ip;

		ctx.raw = raw;

		ctx.access = true;

		await next();
	};
};