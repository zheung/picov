module.exports = async function($) {
	return async function(ctx, next) {
		ctx.$ = $;
		
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

		ctx.raw = raw;

		await next();
	};
};