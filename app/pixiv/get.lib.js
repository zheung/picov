import Axios from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';

import { C } from '../../lib/global.js';


const headers = {
	Referer: 'https://www.pixiv.net/',
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
};

const proxies = {};

const getProxy = url => url ? (proxies[url] ?? (proxies[url] = new HttpsProxyAgent(url))) : null;
const getHeader = cookie => Object.assign({ Cookie: `PHPSESSID=${cookie}` }, headers);


export const getText = async (url, cookie, params, returnData = true) => {
	const response = await Axios.get(url, {
		params,
		responseType: 'text', headers: getHeader(cookie),
		httpsAgent: getProxy(C.proxy.api)
	});

	return returnData ? response.data : response;
};


export const head = async (url, cookie) => {
	return await Axios.head(url, {
		responseType: 'text', headers: getHeader(cookie),
		httpsAgent: getProxy(C.proxy.api)
	});
};

export const getJSON = async (url, cookie, params, returnData = true) => {
	const response = await Axios.get(url, {
		params,
		responseType: 'json', headers: getHeader(cookie),
		httpsAgent: getProxy(C.proxy.api)
	});

	return returnData ? response.data : response;
};

export const postJSON = async (url, cookie, params, headers, returnData = true) => {
	const response = await Axios.post(url, params, {
		responseType: 'json', headers: Object.assign(getHeader(cookie), headers),
		httpsAgent: getProxy(C.proxy.api)
	});

	return returnData ? response.data : response;
};


export const getStream = async (url, cookie, returnData = true) => {
	const response = await Axios.get(url, {
		responseType: 'stream', headers: getHeader(cookie),
		httpsAgent: getProxy(C.proxy.api)
	});

	return returnData ? response.data : response;
};


export const getBuffer = async (url, cookie, returnData = true) => {
	const response = await Axios.get(url, {
		responseType: 'arraybuffer', headers: getHeader(cookie),
		httpsAgent: getProxy(C.proxy.api)
	});

	return returnData ? response.data : response;
};