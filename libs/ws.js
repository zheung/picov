let WebSocket = require('ws');

module.exports = async function($) {
	let wss = new WebSocket.Server({
		// port: 8080,
		noServer: true,
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

	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			L('received: %s', message);
			ws.send(`something${message}`);
		});

		ws.send('something');
	});


	$.httpServ.on('upgrade', function upgrade(request, socket, head) {
		let pathname = _ul.parse(request.url).pathname;

		if(pathname === '/foo') {
			wss.handleUpgrade(request, socket, head, function done(ws) {
				wss.emit('connection', ws, request);
			});
		}
	});
};