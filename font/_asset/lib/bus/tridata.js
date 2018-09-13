let parseCompName = function(name) {
	let match = name.split(/^([a-zA-Z0-9_]+)_(\d+)$/);

	if(match[1] && match[2]) {
		return { comp: match[1], time: ~~match[2] };
	}
	else if(match[0]) {
		return { comp: match[0], time: 1 };
	}

	throw '解析组件名失败，数据初始化失败';
};

export default function(bus, x) {
	bus.compData = {};
	bus.statData = {};

	x.compData = bus.compData;
	x.statData = bus.statData;

	x.init = function(name, compObj = {}, statObj = {}, privObj = {}) {
		let B = bus;

		if(name) {
			let { comp, time } = parseCompName(name);

			if(!bus.compData[comp]) {
				Vue.set(B.compData, comp, compObj);
			}

			if(!bus.statData[comp]) {
				Vue.set(B.statData, comp, {});
			}
			if(!bus.statData[comp][time]) {
				Vue.set(B.statData[comp], time, statObj);
			}

			return Object.assign({ B: bus, X: this, C: compObj, S: statObj }, privObj);
		}

		return Object.assign({ B: bus, X: this }, privObj);
	};

	x.comp = function(name) {
		let { comp } = parseCompName(name);

		return bus.compData[comp] || null;
	};

	x.stat = function(name) {
		let { comp, time } = parseCompName(name);

		return bus.statData[comp] ? bus.statData[comp][time] : null;
	};
}