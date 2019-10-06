module.exports = function($) {
	let { G, R } = $;

	let inject = function(name, result, dest, path) {
		let now = dest;

		if(path[0] != '') {
			for(let key of path) {
				now = now[key] ? now[key] : (now[key] = {});
			}
		}

		now[name] = result;
	};

	let enumFlow = async function(basePath, accum = {}, nowPath = basePath, initer) {
		let list = _fs.readdirSync(nowPath);

		let pathKey = _pa.relative(basePath, nowPath).split(/[\\/]/);

		if(pathKey.length == 1 && pathKey[0] == '') {
			pathKey = [];
		}

		for(let one of list) {
			let sub = R(nowPath, one);

			try {
				let stat = _fs.statSync(sub);
				let pars = _pa.parse(one);

				if(stat.isDirectory()) {
					await enumFlow(basePath, accum, sub, initer);
				}
				else if(stat.isFile() && pars.ext == '.js') {
					let result = await require(sub)($);
					let path = `${[...pathKey, pars.name].join('.')}`;

					if(initer && typeof initer == 'function') {
						let resultInited = await initer(result, path);

						if(resultInited !== false && resultInited !== undefined) {
							inject(pars.name, resultInited, accum, pathKey);
						}
					}
					else {
						inject(pars.name, result, accum, pathKey);
					}
				}
			}
			catch(error) {
				if(error.code == 'ENOENT') {
					G.warn(`加载 [业务]{${sub}}：失败，文件不存在`);
				}
				else {
					G.warn(`加载 [业务]{${sub}}：失败，${error.message}`);
				}
			}
		}

		return accum;
	};

	return enumFlow;
};