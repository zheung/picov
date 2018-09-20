let working = {
};

let workStat = {};

let loopTime = 0;
let statTime = 0;

let interval;

export default function() {
	A.reg('workCenter', 'uapi/workCenter');

	window.WC = {
		add: function(key, from, handle) {
			if(!key || !from || !handle) { return; }

			let work = working[key];

			if(!work) {
				work = working[key] = {};
			}

			work[from] = handle;
		},
		del: function(key, from) {
			if(!key || !from || !working[key] || !working[key][from]) { return; }

			delete working[key][from];

			if(!Object.keys(working[key].length)) {
				delete working[key];
			}
		},
		get: function() {
			return workStat;
		},
		start: function() {
			interval = setInterval(async function() {
				let types = Object.keys(working);

				if(!types.length) {
					return;
				}

				let curTime = ++loopTime;

				try {
					let stats = await A.conn('workCenter', { types: types.join(';') });

					L(types.length, loopTime, statTime);

					if(stats || curTime > statTime) {
						statTime = curTime;
						workStat = stats;
					}
				}
				catch (e) { true; }
			}, 5000);
		},
		stop: function() {
			if(interval) {
				clearInterval(interval);
			}
		},
		working
	};

	WC.start();
}