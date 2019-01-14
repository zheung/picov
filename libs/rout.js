module.exports = async function($ , routArr) {
	let { G, C } = $;

	let routRaws = [
		{ type: 3, path: C.path.dist, prefix: '/', option: { defer: true } },
		{ type: 3, path: R(C.path.cache, 'thumb'), prefix: '/thumb', option: { defer: true } },
		{ id: 1, type: 1, method: 'get', entry: 'listFollow', path: 'api/listFollow', _stat: {} },
		{ id: 2, type: 1, method: 'get', entry: 'listSearch', path: 'api/listSearch', _stat: {} },
		{ id: 3, type: 1, method: 'get', entry: 'listAuthor', path: 'api/listAuthor', _stat: {} },
		{ id: 4, type: 1, method: 'get', entry: 'thumb', path: 'api/thumb', _stat: {} },
		{ id: 5, type: 1, method: 'post', entry: 'save', path: 'api/save', wockType: 1, _stat: {} },
		{ id: 5, type: 1, method: 'get', entry: 'mark', path: 'api/mark', wockType: 1, _stat: {} },
		{ id: 5, type: 1, method: 'get', entry: 'ugoiraFull', path: 'api/ugoiraFull', wockType: 1, _stat: {} },
	];

	$.F = await require('./funcMap')($, C.path.back);
	G.info('加载 [流程]');

	for(let rout of routRaws) {
		if(rout.type != 2 && rout.type != 3) {
			rout.func = $.F._find(rout.entry);
		}

		routArr.push(rout);
	}

	G.info('加载 [路由]');

	return routArr;
};