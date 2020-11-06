const readDirRecur = require('fs-readdir-recursive');

const PA = require('path');

module.exports = async function() {
	const RMD = function(...paths) { return PA.resolve(__main.dir, ...paths); };
	const wrapFlow = require('./flow');

	const pathsAonf = readDirRecur(RMD('apps')).filter(p => p.endsWith('app.js'));

	const aonfs = pathsAonf.map(pathAonf => {
		try {
			const aonf = require(RMD('apps', pathAonf));

			aonf.__path = pathAonf;

			return aonf;
		} catch(error) {
			G.warn('路由', `加载 [应用]入口{${pathAonf}} 失败`, error);
		}
	}).filter(c => c);

	const routs_type = {
		folds: [
			{ path: RMD('dist'), prefix: '/', option: { defer: true } },
		],
		faces: [],
		prxys: [],
	};
	const faces = routs_type.faces;

	for(const aonf of aonfs) {
		if(aonf.faces instanceof Array) {
			const dirApp = PA.parse(aonf.__path).dir;

			for(const face of aonf.faces) {
				face.__pathApp = dirApp;
				face.path = ['uapi', dirApp, ...face.entry.split('.')].join('/');

				const cmr = require(RMD('apps', dirApp, 'api', ...face.entry.split('.')))();
				
				face.handle = wrapFlow(cmr, face.path);

				faces.push(face);
			}
		}
	}

	G.info('路由', '✔');

	return routs_type;

	// let routRaws = [

	// 	{ type: 1, method: 'get', entry: 'listFollow', path: 'api/listFollow', _stat: {} },
	// 	{ type: 1, method: 'get', entry: 'listSearch', path: 'api/listSearch', _stat: {} },
	// 	{ type: 1, method: 'get', entry: 'listAuthor', path: 'api/listAuthor', _stat: {} },
	// 	{ type: 1, method: 'get', entry: 'listNumber', path: 'api/listNumber', wockType: 1, _stat: {} },

	// 	{ type: 1, method: 'get', entry: 'thumb', path: 'api/thumb', _stat: {} },
	// 	{ type: 1, method: 'get', entry: 'header', path: 'api/header', _stat: {} },
	// 	{ type: 1, method: 'get', entry: 'picture', path: 'api/picture', _stat: {} },

	// 	{ type: 1, method: 'post', entry: 'save', path: 'api/save', wockType: 1, _stat: {} },

	// 	{ type: 1, method: 'get', entry: 'mark', path: 'api/mark', wockType: 1, _stat: {} },

	// 	{ type: 1, method: 'get', entry: 'downUgoira', path: 'api/downUgoira', wockType: 1, _stat: {} },
	// 	{ type: 1, method: 'get', entry: 'infoUgoira', path: 'api/infoUgoira', wockType: 1, _stat: {} },

	// 	{ type: 1, method: 'get', entry: 'statAuthor', path: 'api/statAuthor', wockType: 1, _stat: {} },

	// 	{ type: 1, method: 'get', entry: 'authorListFollow', path: 'api/authorListFollow', wockType: 1, _stat: {} },
	// ];

	// $.F = await require('./funcMap')($, C.path.back);
	// G.info('加载 [流程]');

	// for(let rout of routRaws) {
	// 	if(rout.type != 2 && rout.type != 3) {
	// 		rout.func = $.F._find(rout.entry);
	// 	}

	// 	routArr.push(rout);
	// }

	// G.info('加载 [路由]');

	// return routArr;
};