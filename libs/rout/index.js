const PA = require('path');

const getAonfs = require('./aonfs');
const wrapFlow = require('./flow');

module.exports = async function() {
	const RMD = function(...paths) { return PA.resolve(__main.dir, ...paths); };

	const aonfs = getAonfs();

	const routs_type = {
		folds: [
			{ path: RMD('dist'), prefix: '/', option: { maxage: 4 * 60 * 1000, defer: false } },
		],
		faces: [],
	};
	const faces = routs_type.faces;

	for(const aonf of aonfs) {
		if(aonf.faces instanceof Array) {
			const dirApp = PA.parse(aonf.__path).dir;

			for(const face of aonf.faces) {
				face.__pathApp = dirApp;
				face.path = ['uapi', dirApp, ...face.entry.split('.')].join('/');

				const cmr = require(RMD(
					'apps', dirApp,
					...face.entry.split('.').map((p, i, g) => (i == g.length - 1) ? p + '.api' : p)
				))();

				face.handle = wrapFlow(cmr, face.path);

				faces.push(face);
			}
		}
	}

	G.info('服务', '路由', '✔');

	return routs_type;
};