const arrayBufferToString = function(arrayBuffer) {
	return decodeURIComponent(
		escape(
			String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
		)
	);
};

class Wock {
	constructor(
		url, {
			ping = true,
			autoOpen = true,
			timeouts = { open: 1000 * 14, ping: 1000 * 24, pingCycle: 1000 * 14, reopen: 1000 * 14 },
			logger = false
		} = {},
		atOpen
	) {
		this.url = url;
		this.pingReady = ping;
		this.handles = {};
		this.timeouts = timeouts;
		this.atOpen = atOpen;

		if(logger === true) {
			this.L = (console || {}).log;
			this.LE = (console || {}).error;
		}
		else if(logger && typeof logger == 'object') {
			this.L = logger.log;
			this.LE = logger.error || logger.log;
		}
		else {
			this.L = this.LE = function() { };
		}

		if(autoOpen) {
			this.open('init');
		}
	}

	open(why) {
		if(this.wock && this.wock.readyState < WebSocket.CLOSED) { return; }

		this.L(`Wock open by ${why}`);

		this.wock = new WebSocket(this.url);
		this.wock.timeouts = { open: null, ping: null, pingCycle: null };

		this.wock.addEventListener('error', (error) => this.closeHandle(`error, ${error.message || error}`));
		this.wock.addEventListener('close', (event) => this.closeHandle(`close, ${event.reason || this.closeReason}`));

		this.wock.timeouts.open = setTimeout(() => this.wock.close(0, `open timeout(>=${this.timeouts.open})`), this.timeouts.open);

		this.wock.addEventListener('open', () => {
			clearTimeout(this.wock.timeouts.open);

			this.wock.addEventListener('message', async raw => {
				if(this.ping) { this.pongHandle(); }

				let event = {};

				if(raw.data instanceof Blob) {
					const reader = new FileReader();
					reader.readAsArrayBuffer(raw.data);
					const buffer = await new Promise(resolve => reader.onload = result => resolve(result.target.result));

					const view = new DataView(buffer);

					const sizeBins = view.getUint16(0);
					const sizeJSON = view.getUint32(2);
					let pos = 2 + (sizeBins + 1) * 4;

					try {
						const bufferJSON = buffer.slice(pos, pos += sizeJSON);

						event = JSON.parse(arrayBufferToString(bufferJSON));
					} catch(error) { return; }

					const bins = [];
					for(let i = 1; i <= sizeBins; i++) {
						bins.push(buffer.slice(pos, pos += buffer.getUint32(2 + i * 4)));
					}
				}
				else {
					try {
						event = JSON.parse(raw.data);
					}
					catch(error) { return; }
				}


				if(event.type && this.handles[event.type]) {
					if(event.data instanceof Array) {
						this.handles[event.type](this.wock, ...event.data);
					}
					else {
						this.handles[event.type](this.wock, event.data);
					}
				}
			});

			this.ping = this.pingReady;

			if(typeof this.atOpen == 'function') {
				this.atOpen(this);
			}
		});
	}
	closeHandle(why) {
		if(this.wock.closeOff) { return; }
		this.wock.closeOff = true;

		this.LE(`Wock closed by ${why}`);

		clearTimeout(this.wock.timeouts.open);
		clearTimeout(this.wock.timeouts.ping);
		clearTimeout(this.wock.timeouts.pingCycle);

		if(this.timeouts.reopen) {
			setTimeout(() => this.open('reopen(auto)'), this.timeouts.reopen);
		}
	}

	set ping(value) {
		this.wock.timesPingout = 0;

		if(value) {
			this.wock.addEventListener('pong', this.pongListener = this.pongHandle.bind(this));

			this.wock.ping();
		}
		else {
			clearTimeout(this.wock.timeouts.ping);
			clearTimeout(this.wock.timeouts.pingCycle);

			this.wock.removeEventListener('pong', this.pongListener);
		}
	}
	pongHandle() {
		clearTimeout(this.wock.timeouts.ping);
		clearTimeout(this.wock.timeouts.pingCycle);

		this.wock.timeouts.pingCycle = setTimeout(() => {
			this.wock.ping();

			this.wock.timeouts.ping = setTimeout(() => {
				this.wock.timesPingout++;

				if(this.wock.timesPingout >= 4) {
					this.wock.close(0, 'ping timeout(>=4)');
				}
				else {
					this.wock.ping();
				}
			}, this.timeouts.ping);
		}, this.timeouts.pingCycle);
	}


	cast(type, ...data) {
		try {
			this.wock.send(JSON.stringify({ type, data }));
		}
		catch(error) {
			if(!error.message.includes('CLOSED')) {
				this.LE(error.stack);
			}
		}
	}
}

export default Wock;