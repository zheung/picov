const wrapperC = require('./statge/control');
const wrapperM = require('./statge/model');
const wrapperR = require('./statge/render');

module.exports = function(faces, rout, wrapper = {}) {
	if(
		typeof faces != 'object' ||
		(
			typeof faces.c != 'function' &&
			typeof faces.m != 'function' &&
			typeof faces.r != 'function'
		)
	) {
		return false;
	}

	const warpC = (typeof wrapper.C == 'function' ? wrapper.C : wrapperC)(faces.c);
	const warpM = (typeof wrapper.M == 'function' ? wrapper.M : wrapperM)(faces.m);
	const warpR = (typeof wrapper.R == 'function' ? wrapper.R : wrapperR)(faces.r);

	return async function(raw, ctx) {
		ctx.type = 'json';

		const flow = { raw };
		ctx.flow = flow;

		let statge;
		try {
			statge = 'control';
			typeof warpC == 'function' ? await warpC(ctx) : null;
			statge = 'model';
			typeof warpM == 'function' ? await warpM(ctx) : null;
			statge = 'render';
			typeof warpR == 'function' ? await warpR(ctx) : null;

			return {
				success: true,
				data: flow.result
			};
		}
		catch(cmd) {
			let stat;
			let data;
			let type;

			if(cmd instanceof Error || typeof cmd == 'string') {
				const user = (raw && raw._userID) ? `用户: {${raw._nick}(${raw._userID})}` : '';

				G.error(`海港`, `运行 [接口], 路由{${rout}}.${statge}`, cmd, user);

				stat = 2;
				data = cmd.message || cmd;
			}
			else if(typeof cmd == 'number') {
				stat = cmd;
			}
			else if(cmd instanceof Array) {
				[stat, data, type] = cmd;
			}
			else if(typeof cmd == 'object' && cmd) {
				({ stat, data, type } = cmd);
			}

			// 1, 参数不通过, 返回错误提示
			if(stat == 1) {
				return {
					success: false,
					message: data || '参数不通过'
				};
			}
			// 2, 运行错误, 返回错误提示
			else if(stat == 2) {
				return {
					success: false,
					text: data || '运行错误'
				};
			}
			// 3, 跳出, 提前结束, 返回结果
			else if(stat == 3) {
				return {
					success: true,
					data: data
				};
			}
			// status4, 提前结束, 返回结果(非JSON)
			else if(stat == 4) {
				ctx.type = type;

				return data;
			}
		}

	};
};