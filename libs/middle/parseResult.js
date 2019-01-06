module.exports = async function() {
	return async function(ctx, next) {
		await next();

		let result = ctx.body || {};

		// 提取status
		let status = ~~result._stat;
		let type = result._type || 'json';

		delete result._stat;
		delete result._type;

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

			ctx.type = type;
		}
		// status1，不用包裹，直接返回结果
		else if(status == 1) {
			ctx.body = result;

			ctx.type = type;
		}
		// status2，参数不通过，返回错误提示
		else if(status == 2) {
			ctx.body = {
				success: false,
				text: result._text || '参数不通过'
			};

			ctx.type = type;
		}
		// status3，运行错误，返回结果
		else if(status == 3) {
			ctx.body = {
				success: false,
				text: result._text || '运行错误'
			};

			ctx.type = type;
		}
	};
};