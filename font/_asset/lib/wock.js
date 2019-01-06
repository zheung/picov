
export default function() {
	window.W = {
		cast: function(type, ...data) {
			W.wock.cast(type, ...data);
		},

		add: function(name, func) {
			if(!name && !(func instanceof Function)) { return false; }

			handDict[name] = func;
		},
		del: function(name) {
			if(!name) { return false; }

			delete handDict[name];
		},
		get: function(name) {
			return handDict[name];
		},
		run: function(name, ...data) {
			handDict[name](...data);
		}
	};


	let ping = false;
	let opening = false;

	let handDict = {
		ping: function(wock) {
			wock.cast('pong');
		}
	};

	let open = function(reason) {
		if(opening) { return; }

		L('wock open by '+reason);

		try {
			W.wock = new WebSocket(`ws://${window.location.host}/wock`);
		}
		catch (error) {
			setTimeout(function() { open(`错误，${error.message}`); }, 4000);
		}

		let pingOut;
		let timeOut;
		let outCount = 0;

		let oneOff = false;
		let closeHandle = function(reason) {
			if(oneOff) { return; }

			oneOff = true;

			L(`Wock关闭, 原因: ${reason}`);

			if(ping) {
				clearTimeout(pingOut);
				clearTimeout(timeOut);
			}

			opening = false;
			setTimeout(function() { open('重连'); }, 4000);
		};

		W.wock.addEventListener('error', function() { closeHandle('错误'); });
		W.wock.addEventListener('close', function() { closeHandle('关闭连接'); });

		W.wock.addEventListener('open', function() {
			opening = false;

			W.wock.cast = function(type, ...data) {
				try {
					W.wock.send(JSON.stringify({ type, data }));
				}
				catch(error) {
					if(error.message.indexOf('CLOSED') == -1) {
						LE(error.stack);
					}
				}
			};

			let check = function(clearCount = true) {
				clearTimeout(pingOut);
				clearTimeout(timeOut);

				if(clearCount) {
					outCount = 0;
				}

				pingOut = setTimeout(function() {
					W.wock.cast('ping');

					timeOut = setTimeout(function() {
						outCount++;

						if(outCount >= 4) {
							W.wock.close();
						}
						else {
							check(false);
						}
					}, 24000);
				}, 10000);
			};

			W.wock.addEventListener('message', function(raw) {
				if(ping) { check(); }

				let event = {};
				try {
					event = JSON.parse(raw.data);
				}
				catch(error) { return; }

				if(event.type && handDict[event.type]) {
					if(event.data instanceof Array) {
						handDict[event.type](W.wock, ...event.data);
					}
					else {
						handDict[event.type](W.wock, event.data);
					}
				}
			});

			if(ping) { check(); }
		});
	};

	open('init');
}