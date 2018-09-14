let raw = [
	[ 'get', '1', 'listFollow' ],
	[ 'get', '1', 'listAuthor' ],
	[ 'get', '4', 'thumb' ],
];

let routes = [];

for(let route of raw) {
	routes.push({
		method: route[0],
		type: route[1],
		path: route[2],
		entry: route[3] || route[2]
	});
}

module.exports = routes;