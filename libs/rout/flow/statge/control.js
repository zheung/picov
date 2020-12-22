module.exports = function(control) {
	if(typeof control !== 'function') {
		return false;
	}

	return async function(flow) {
		const { raw, ctx } = flow;

		let option = await control.bind(ctx)(raw);

		// 如果返回为未定义，则视raw为返回值
		if(option === undefined) { option = raw; }

		flow.result = flow.option = option;
	};
};