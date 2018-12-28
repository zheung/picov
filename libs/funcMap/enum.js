module.exports = function($) {
	let { G, R } = $;

	let enumFlow = async function(basePath, accum = {}, nowPath = basePath) {
		let list = _fs.readdirSync(nowPath);

		let pathKey = _pa.relative(basePath, nowPath).split(/[\\/]/);

		for(let one of list) {
			let sub = R(nowPath, one);

			try {
				let stat = _fs.statSync(sub);
				let pars = _pa.parse(one);

				if(stat.isDirectory()) {
					await enumFlow(basePath, accum, sub);
				}
				else if(stat.isFile() && pars.ext == '.js') {
					let func = await require(sub)($);

					if(typeof func == 'function') {
						let now = accum;

						if(pathKey[0] != '') {
							for(let key of pathKey) {
								now = now[key] ? now[key] : (now[key] = {});
							}
						}

						now[pars.name] = func;
					}
				}
			}
			catch(error) {
				if(error.code == 'ENOENT') {
					G.warn(`加载 [流程]{${sub}}：失败，文件不存在`);
				}
				else {
					G.warn(`加载 [流程]{${sub}}：失败，${error.message}`);
				}
			}
		}

		return accum;
	};

	return enumFlow;
};