import { get, post } from 'axios';

const actionList = {};

window.get = get;

export const A = {
	reg(action, prefix = './uapi/picov/', forceReg = false) {
		if(!action) {
			return;
		}

		if(forceReg || !actionList[action]) {
			return actionList[action] = prefix + action;
		}
		else {
			return actionList[action];
		}
	},
	async conn(action, params, conf = {}, prefix = './uapi/picov/') {
		let actionUrl = A.reg(action, prefix);

		if(params) {
			conf.params = params;
		}

		const result = (await get(actionUrl, conf)).data;

		if(result.success) {
			return result.data;
		}
		else {
			alert(`请求错误: ${result.message}`);

			throw result.message;
		}
	},

	async post(action, params, conf = {}, prefix = './uapi/picov/') {
		let actionUrl = A.reg(action, prefix);

		if(typeof params == 'object' && params instanceof FormData) {
			if(typeof conf.headers == 'object' && conf.headers) {
				conf.headers['Content-Type'] = 'multipart/form-data';
			}
			else {
				conf.headers = { 'Content-Type': 'multipart/form-data' };
			}
		}

		return (await post(actionUrl, params, conf)).data;
	},

	jump(action, params, prefix = './uapi/picov/') {
		let actionUrl = A.reg(action, prefix);
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

		window.location.href = `${actionUrl}?${query}`;
	}
};