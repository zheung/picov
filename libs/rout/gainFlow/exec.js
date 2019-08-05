module.exports = function({ G }) {
	return async function(flower, raw, ctx = {}, stages = [ ['c', 'controll'], ['m', 'model'], ['r', 'render'] ]) {

		let result = raw; // 结果
		let option; // 结果
		let status; // 状态码
		let type; // 状态码

	// 各阶段的调用
		for(let i=0; i<stages.length; i++) {
			let [ stage, stageName ] = stages[i];
			let func = flower[stage];

		// 调用对应阶段的函数
			try {
				if(i == 0) {
					result = await func.bind(flower)(result, ctx);
				}
				else if(i == 1) {
					result = await func.bind(flower)(result);
					option = result || result;
				}
				else if(i == 2) {
					result = await func.bind(flower)(result, raw, option, ctx) || result;
				}

				if(result == undefined) {
					throw '结果返回异常';
				}
			}
			catch(error) {
				if(raw) {
					G.error(`执行 [接口]: 错误, 路径: {${flower.pathFunc}} 函数: {${stageName}} 用户: {${raw._nick}(${raw._userID})}\r\n${error.stack || error}\r\n${JSON.stringify(raw)}`);
				}
				else {
					G.error(`执行 [接口]: 错误, 路径: {${flower.pathFunc}} 函数: {${stageName}} 用户: 无\r\n${error.stack || error}\r\nraw: ${raw}`);
				}
				result = { _stat: 3, _text: error.message || error };
			}

			// 提取status/type
			status = ~~result._stat;
			type = result._type;

			// 如果存在_data，则用_data替换为结果
			if(result._data) {
				result = result._data;
			}

		// 根据状态码决定下一步
		// status0，正常返回，继续下一步
			if(status == 0) {
				continue;
			}
		// status1，已获得最终结果，不继续了，返回结果
			else if(status == 1) {
				delete result._stat;
				delete result._type;

				ctx.type = 'json';

				return {
					success: true,
					data: result
				};
			}
		// status2，参数不通过，返回错误提示
			else if(status == 2) {
				ctx.type = 'json';

				return {
					success: false,
					text: result._text || '参数不通过'
				};
			}
		// status3，运行错误，返回结果
			else if(status == 3) {
				ctx.type = 'json';

				return {
					success: false,
					text: result._text || '运行错误'
				};
			}
		// status4, 已获得最终结果, 不继续了, 返回结果(不封装)
			else if(status == 4) {
				delete result._stat;
				delete result._type;

				ctx.type = type;

				return result;
			}
		}

		return {
			success: true,
			data: result
		};
	};
};