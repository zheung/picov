module.exports = async function($) {
	let { G, wockServ } = $;

	let data = {
		online: 0
	};
	let handle = {
		ping: function(wock) {
			wock.cast('pong');
		}
	};
	let worker = {

	};

	wockServ.on('connection', function(wock) {
		G.info(`新[连接]，当前在线：${++data.online}`);

		wock.cast = function(type, ...data) {
			wock.send({ type, data });
		};

		let oneOff = false;
		let closeHandle = function(reason) {
			if(oneOff) { return; }

			oneOff = true;

			G.info(`一[连接]断开，原因：${reason}。当前在线：${--data.online}`);
		};

		wock.on('error', function(error) { closeHandle(`错误，${error.message}`); });
		wock.on('close', function() { closeHandle('关闭连接'); });

		let pingOut;
		let timeOut;

		let check = function() {
			clearTimeout(pingOut);
			clearTimeout(timeOut);

			pingOut = setTimeout(function() {
				wock.send({ event: 'ping' });

				timeOut = setTimeout(function() {
					wock.close();
				}, 24000);
			}, 10000);
		};

		wock.on('message', function(event) {
			check();

			if(event.type && handle[event.type]) {
				handle(wock, ...event.data);
			}
		});

		check();
	});

	return worker;
};