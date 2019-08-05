module.exports = async function($, routArr) {
	let { G, C } = $;
	G.info('加载 [业务]');
	let F = await require('./gainFlow')($);

	G.info('加载 [路由]');
	let routRaws = [
		{ type: 3, path: C.path.dist, prefix: '/', option: { defer: true } },

		{ type: 1, method: 'get', entry: 'list', path: 'api/list', wockType: 1 },
		{ type: 1, method: 'get', entry: 'listNumber', path: 'api/listNumber', wockType: 1 },

		{ type: 1, method: 'get', entry: 'thumb', path: 'api/thumb' },
		{ type: 1, method: 'get', entry: 'header', path: 'api/header' },
		{ type: 1, method: 'get', entry: 'picture', path: 'api/picture' },

		{ type: 1, method: 'post', entry: 'save', path: 'api/save', wockType: 1 },

		{ type: 1, method: 'get', entry: 'mark', path: 'api/mark', wockType: 1 },

		{ type: 1, method: 'get', entry: 'statAuthor', path: 'api/statAuthor', wockType: 1 },

		{ type: 1, method: 'get', entry: 'authorListFollow', path: 'api/authorListFollow', wockType: 1 },
	];

	for(let rout of routRaws) {
		rout._stat = {};

		if(rout.type != 2 && rout.type != 3) {
			rout.func = F._find(rout.entry);
		}

		routArr.push(rout);
	}

	return routArr;
};