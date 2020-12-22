module.exports = function(render) {
	if(typeof render !== 'function') {
		return false;
	}

	return async function(flow) {
		const { raw, ctx } = flow;

		flow.result = await render.bind(ctx)(flow.result, flow.option, raw);
	};
};