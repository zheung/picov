module.exports = function(render) {
	if(typeof render !== 'function') {
		return false;
	}

	return async function(ctx) {
		ctx.flow.result = await render(ctx.flow.result, ctx.flow.option, ctx.flow.raw);
	};
};