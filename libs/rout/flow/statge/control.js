module.exports = function(control) {
	if(typeof control !== 'function') {
		return false;
	}

	return async function(ctx) {
		let option = await control.bind(ctx)(ctx.raw);

		// 如果返回为未定义，则视raw为返回值
		if(option === undefined) { option = ctx.raw; }

		ctx.flow.result = ctx.flow.option = option;
	};
};