import axios from 'axios';

let actions = {
	init: 'uapi/init'
};

let prefix = './';

export default function() {
	window.A = {
		conn: async function(action, params, conf = {}) {
			if(params) {
				conf.params = params;
			}

			let result = (await axios.get(prefix + actions[action], conf)).data;

			if(result.success) {
				return result.data;
			}
			else {
				throw result.text;
			}
		},
		connRaw: async function(action, params, conf = {}) {
			if(params) {
				conf.params = params;
			}

			return (await axios.get(prefix + actions[action], conf)).data;
		},

		post: async function(action, params, conf = {}) {
			if(typeof params == 'object' && params instanceof FormData) {
				if(typeof conf.headers == 'object' && conf.headers) {
					conf.headers['Content-Type'] = 'multipart/form-data';
				}
				else {
					conf.headers = { 'Content-Type': 'multipart/form-data' };
				}
			}

			let result = (await axios.post(prefix + actions[action], params, conf)).data;

			if(result.success) {
				return result.data;
			}
			else {
				throw result.text;
			}
		},
		postRaw: async function(action, params, conf = {}) {
			return (await axios.post(prefix + actions[action], params, conf)).data;
		},

		jump: function(action, params) {
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

			window.location.href = `${prefix}${actions[action]}?${query}`;
		},

		reg: function(action, path, force) {
			if(force || !actions[action]) {
				actions[action] = path;
			}
		}
	};
}