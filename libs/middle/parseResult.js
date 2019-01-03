module.exports = async function() {
	return async function(ctx, next) {
		await next();

		let result = ctx.body;

		// 提取status
		let status = ~~result._stat;

		// 如果存在_data，则用_data替换为结果
		if(result._data) {
			result = result._data;
		}

		// 根据状态码决定下一步
		// status0，正常返回，继续下一步
		if(status == 0) {
			ctx.body = {
				success: true,
				data: result
			};
		}
		// status1，已获得最终结果，不继续了，返回结果
		else if(status == 1) {
			delete result._stat;

			ctx.body = {
				success: true,
				data: result
			};
		}
		// status2，参数不通过，返回错误提示
		else if(status == 2) {
			ctx.body = {
				success: false,
				text: result._text || '参数不通过'
			};
		}
		// status3，运行错误，返回结果
		else if(status == 3) {
			ctx.body = {
				success: false,
				text: result._text || '运行错误'
			};
		}
	};
};