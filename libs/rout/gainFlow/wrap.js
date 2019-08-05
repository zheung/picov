module.exports = function({ DB }, execFlow) {
	return function(funcMap, pathFunc) {
		if(typeof funcMap != 'object' || (
			typeof funcMap.c != 'function' &&
			typeof funcMap.m != 'function' &&
			typeof funcMap.r != 'function'
		)) {
			return false;
		}

		let flower = async function(raw, ctx) {
			return await execFlow(flower, raw, ctx);
		};

		flower.pathFunc = pathFunc;

		flower.c = async function(raw, ctx) {
			if(!funcMap.c) {
				return raw;
			}

			let result = await funcMap.c(raw, ctx);

			// 如果返回为无效值，则视raw为返回值
			if(result == undefined) {
				result = raw || {};
			}

			return result;
		};

		flower.m = async function(option) {
			if(!funcMap.m) {
				return option;
			}

			let conn;
			let result;

			try {
				conn = await DB.pick();

				result = await funcMap.m(option, conn, conn.query, conn.format);

				if(result == undefined) {
					throw '{model}函数{返回值}无效';
				}
			}
			finally {
				conn.close();
			}

			return result;
		};

		flower.r = async function(result, raw, option) {
			if(!funcMap.r) {
				return result;
			}

			let result2 = await funcMap.r(result, raw, option);

			if(!result) {
				throw '{render}函数{返回值}无效';
			}

			return result2;
		};

		return flower;
	};
};