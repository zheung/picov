const initMareParseResult = ($) => {
	return async (ctx, next) => {
		const rout = ctx.rout;

		if(rout.parseResult) {
			try {
				const body = ctx.body;

				if(body instanceof Error) {
					ctx.body = { success: false, message: body.message };
				}
				else {
					ctx.body = { success: true, data: body };
				}
				ctx.type = 'json';
			}
			catch {
				ctx.status = 500;
			}
		}

		await next();
	};
};


export default initMareParseResult;