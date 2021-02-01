const readDirRecur = require('fs-readdir-recursive');

const PA = require('path');

module.exports = function() {
	const RMD = function(...paths) { return PA.resolve(__main.dir, ...paths); };

	const pathsAonf = readDirRecur(RMD('apps')).filter(p => p.endsWith('app.js'));

	const aonfs = pathsAonf.map(pathAonf => {
		try {
			const aonf = require(RMD('apps', pathAonf));

			aonf.__path = pathAonf;
			aonf.__dir = PA.parse(pathAonf).dir;

			return aonf;
		} catch(error) {
			G.warn('服务', '路由', `加载 [应用]入口{${pathAonf}} 失败`, error);
		}
	}).filter(c => c);

	return aonfs;
};