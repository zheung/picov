let raw = [
	[ 'get', '1', 'listFollow' ],
	[ 'get', '1', 'listAuthor' ],
	[ 'get', '4', 'thumb' ],
	[ 'post', '1', 'save' ],
	[ 'get', '1', 'workCenter' ],
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