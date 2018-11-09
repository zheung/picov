
export default function() {
	let wock;

	let opening = false;

	let open = function(reason) {
		if(opening) {
			return;
		}
		else {
			opening = true;
		}

		L('wock open by '+reason);

		wock = new WebSocket(`ws://${window.location.host}/wock`);

		wock.cast = function(type, data) {
			wock.send({ type, data });
		};

		let oneOff = false;
		let reopen = function(reason) {
			if(oneOff) { return; }

			oneOff = true;

			opening = false;

			setTimeout(function() {
				open(reason);
			}, 4000);
		};

		wock.addEventListener('error', function() { reopen('error'); });
		wock.addEventListener('close', function() { reopen('close'); });

		let pingOut;
		let timeOut;

		let check = function() {
			clearTimeout(pingOut);
			clearTimeout(timeOut);

			pingOut = setTimeout(function() {
				wock.cast('ping');

				timeOut = setTimeout(function() {
					wock.close();
				}, 24000);
			}, 10000);
		};

		wock.addEventListener('open', function() {
			opening = false;

			check();
		});

		wock.addEventListener('message', function() {
			check();

		});

	};

	open('init');

	let worker = {};
	let emiter = {
		ping: function(wock) {
			wock.cast('pong');
		}
	};

	$.B.center = { emiter, worker };

	window.W = {
		add
	}
}