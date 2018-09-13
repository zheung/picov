let raw = [
	[ 'get', '1', 'abc', 'bus.dict' ],
];

let routes = [];

for(let route of raw) {
	routes.push({
		method: route[0],
		type: route[1],
		path: route[2],
		entry: route[3]
	});
}

module.exports = routes;