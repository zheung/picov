import Axios from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';

import { C } from '../../lib/global.js';


const headers = {
	Referer: 'https://www.pixiv.net/',
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36'
};

const proxies = {};

const getProxy = url => url ? (proxies[url] ?? (proxies[url] = new HttpsProxyAgent(url))) : null;
const getHeader = cookie => Object.assign({ Cookie: `PHPSESSID=${cookie}` }, headers);


export const getJSON = async (url, cookie, returnData = true) => {
	const response = await Axios.get(url, {
		responseType: 'json', headers: getHeader(cookie),
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