import axios from 'axios';

let actionList = {
};

let prefixDict = {
	api: './api/',
};

export default function() {
	window.A = {
		conn: async function(action, params, conf = {}) {
			let actUrl = A.r(action);

			if(params) {
				conf.params = params;
			}

			let result = (await axios.get(actUrl, conf)).data;

			if(result.success) {
				if(result.data && result.data.alert) {
					await X.alert(result.data.alert);
				}

				return result.data;
			}
			else {
				throw result.text;
			}
		},
		connRaw: async function(action, params, conf = {}) {
			let actUrl = A.r(action);

			if(params) {
				conf.params = params;
			}

			return (await axios.get(actUrl, conf)).data;
		},

		post: async function(action, params, conf = {}) {
			let actUrl = A.r(action);

			if(typeof params == 'object' && params instanceof FormData) {
				if(typeof conf.headers == 'object' && conf.headers) {
					conf.headers['Content-Type'] = 'multipart/form-data';
				}
				else {
					conf.headers = { 'Content-Type': 'multipart/form-data' };
				}
			}

			let result = (await axios.post(actUrl, params, conf)).data;

			if(result.success) {
				if(result.data && result.data.alert) {
					await X.alert(result.data.alert);
				}

				return result.data;
			}
			else {
				throw result.text;
			}
		},
		postRaw: async function(action, params, conf = {}) {
			let actUrl = A.r(action);

			return (await axios.post(actUrl, params, conf)).data;
		},

		jump: function(action, params) {
			let actUrl = A.r(action);
			let query = '';

			for(let key in params) {
				if(params[key]) {
					if(typeof params[key] == 'object') {
						query += `&${key}=${JSON.stringify(params[key])}`;
					}
					else {
						query += `&${key}=${params[key]}`;
					}
				}
			}

			query = query.replace(/^&/, '');

			window.location.href = `${actUrl}?${query}`;
		},

		reg: function(action, path, force) {
			if(force || !actionList[action]) {
				actionList[action] = path;
			}
		},

		r: function(action, prefix = 'api', forceReg = false) {
			if(forceReg || !actionList[action]) {
				return actionList[action] = prefixDict[prefix]+action;
			}
			else {
				return actionList[action];
			}
		}
	};
}