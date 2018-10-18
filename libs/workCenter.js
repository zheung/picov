module.exports = function() {
	let list = {};

	let WC = {
		add: function(key, state) {
			if(!key || list[key]) { return; }

			list[key] = state;

			return state;
		},
		mod: function(key, state) {
			if(!key) { return; }

			list[key] = state;

			return state;
		},
		del: function(key) {
			if(!key || !list[key]) { return; }

			delete list[key];
		},
		get: function(key) {
			return list[key];
		},
		lst: function(keys) {
			if(!keys || typeof keys != 'object' || !(keys instanceof Array)) { return; }

			let map = {};

			for(let key of keys) {
				if(!key || !list[key]) { continue; }

				map[key] = list[key];
			}

			return map;
		},
		_list: list
	};

	E.picov.WC = WC;
};