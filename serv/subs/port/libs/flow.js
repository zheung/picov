// 控制整个接口流程
let runFlow = async function(flow, raw, stages = [ 'c', 'm', 'r' ]) {
	let result = raw; // 结果
	let option; // 结果
	let status; // 状态码

// 各阶段的调用
	for(let i=0; i<stages.length; i++) {
		let func = flow.flower[stages[i]];

	// 调用对应阶段的函数
		try {
			if(i == 0) {
				result = await func(result) || result;
			}
			else if(i == 1) {
				result = await func(result);
				option = result._data || result;
			}
			else if(i == 2) {
				result = await func(result, raw, option) || result;
			}

			if(result == undefined || result == null) {
				throw '结果返回异常';
			}
		} catch(error) {
			LE(error.stack || error );
			result = { _stat: 3, _text: error.message || error };
		}

		// 提取status
		status = ~~result._stat;
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

			return {
				success: true,
				data: result
			};
		}
	// status2，参数不通过，返回错误提示
		else if(status == 2) {
			return {
				success: false,
				text: result._text || '参数不通过'
			};
		}
	// status3，运行错误，返回结果
		else if(status == 3) {
			return {
				success: false,
				text: result._text || '运行错误'
			};
		}
	}

	return {
		success: true,
		data: result
	};
};


module.exports = async function($) {
	let flowDict = {};
	let flows = require(await $.pa('route'));

// 流程化
	for(let flow of flows) {
		let funcPath = await $.pa(J($.conf.pathCode, ...flow.entry.split('.')));

		let func;
		try {
			func = require(funcPath);
		}
		catch(error) {
			LE(error.message);
			continue;
		}

		flow.flower = async function(raw) {
			let result = await runFlow(flow, raw);

			return result;
		};

		flow.flower.c = async function(raw) {
			if(!func.c) {
				return raw;
			}

			let result = await func.c(raw, flowDict, $.conf);

			// 如果返回为无效值，则视raw为返回值
			if(!result) {
				result = raw || {};
			}

			return result;
		};
		flow.flower.m = async function(option) {
			if(!func.m) {
				return option;
			}

			let conn = {};
			let result;

			try {
				// conn = await $.db.pick();

				result = await func.m(option, $.db);

				if(!result) {
					throw 'model return null';
				}
			}
			finally {
				// conn.close();
			}

			return result;
		};
		flow.flower.r = async function(result, raw, option) {
			if(!func.r) {
				return result;
			}

			let result2 = await func.r(result, raw, option);

			if(!result) {
				throw 'render return null';
			}

			return result2;
		};

	// 字典化
		let paths = flow.entry.split('.');

		for(let i=0, path=paths[i], objNow = {}; i<paths.length; i++, path = paths[i]) {
			if(i<paths.length-1) {
				objNow = flowDict[path] || (flowDict[path] = {});
			}
			else {
				objNow[path] = flow.flower;
			}
		}
	}

	return flows;
};