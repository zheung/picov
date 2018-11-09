module.exports = async function($) {
	let WebSocket = require('ws');

	let wockServ = new WebSocket.Server({
		noServer: true,
		// port: 911,
		perMessageDeflate: {
			zlibDeflateOptions: {
				chunkSize: 1024,
				memLevel: 7,
				level: 3,
			},
			zlibInflateOptions: {
				chunkSize: 10 * 1024
			},
			clientNoContextTakeover: true,
			serverNoContextTakeover: true,
			serverMaxWindowBits: 10,
			concurrencyLimit: 10,
			threshold: 1024,
		}
	});

	$.httpServ.on('upgrade', function(request, socket, head) {
		if(_ul.parse(request.url).pathname == '/wock') {
			wockServ.handleUpgrade(request, socket, head, function(ws) {
				wockServ.emit('connection', ws, request);
			});
		}
	});

	return wockServ;
};