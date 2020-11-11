const PA = require('path');

const parseConf = {
	server(C) {
		const RD = function(...paths) { return PA.resolve(C.__fold, ...paths); };

		if(C.name === undefined || C.name === null) { C.name = PA.parse(__main).name; }
		if(C.path === undefined || C.path === null) { C.path = {}; }
		if(C.proxies === undefined || C.proxies === null) { C.proxies = {}; }
		if(C.log === undefined || C.log === null) { C.log = {}; }

		if(C.headers === undefined || C.headers === null) {
			C.headers = {
				Referer: 'https://www.pixiv.net/',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36'
			};
		}

		if(C.log.path) { C.log.path = RD(C.log.path); }

		if(!C.path.temp) { C.path.temp = PA.resolve(require('os').tmpdir(), 'picov'); }

		const parsePathRecur = function(object) {
			for(const key in object) {
				const value = object[key];
				const type = typeof value;

				if(type == 'string') {
					object[key] = RD(value);
				}
				else if(type == 'object' || type) {
					parsePathRecur(value);
				}
			}
		};

		parsePathRecur(C.path);

		require('fs-extra').ensureDirSync(C.path.temp);

		return C;
	}
};

const confs = {};

module.exports = function(type = null, pathDir = PA.parse(require.main.filename).dir) {
	if(confs[type]) { return confs[type]; }

	const nameFile = type ? `config.${type}.js` : 'config.js';

	const confRaw = require(PA.resolve(pathDir, nameFile));

	const C = typeof confRaw == 'function' ? (confRaw()) : confRaw;

	C.__name = nameFile;
	C.__fold = pathDir;

	return confs[type] = parseConf[type](C);
};