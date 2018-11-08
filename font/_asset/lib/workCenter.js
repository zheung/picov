let working = {
};

let dying = {};

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

			if(!Object.keys(working[key]).length) {
				delete working[key];

				dying[key] = true;
			}
		},
		get: function() {
			return workStat;
		},
		start: function() {
			interval = setInterval(async function() {
				let types = Object.keys(working);
				let dels = Object.keys(dying);

				if(!types.length && !dels.length) {
					return;
				}

				let curTime = ++loopTime;

				try {
					let stats = await A.conn('workCenter', { types: types.join(';'), dels: dels.join(';') });

					for(let del of dels) {
						delete dying[del];
					}

					if(stats || curTime > statTime) {
						statTime = curTime;
						workStat = stats;

						for(let key in working) {
							let stat = workStat[key];

							for(let from in working[key]) {
								try {
									working[key][from](stat);
								}
								catch(error) {
									G.error(error.stack);
								}
							}
						}
					}
				}
				catch (e) { true; }
			}, 2000);
		},
		stop: function() {
			if(interval) {
				clearInterval(interval);
			}
		},
		working
	};

	window.WC.start();
}