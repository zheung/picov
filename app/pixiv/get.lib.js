import HTTPS from 'https';
import Axios from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';

import { C } from '../../lib/global.js';


const headers = {
	Referer: 'https://www.pixiv.net/',
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
};

const assignHeader = cookie => Object.assign({ Cookie: `PHPSESSID=${cookie}` }, headers);


const proxies = { $: C.proxy?.$ ? new HttpsProxyAgent(C.proxy?.$) : new HTTPS.Agent({ rejectUnauthorized: false }) };

const getProxy = url => {
	const host = new URL(url).host;

	if(host in proxies) { return proxies[host]; }

	if(host in C.proxy) { return proxies[host] = C.proxy[host] ? new HttpsProxyAgent(C.proxy[host]) : new HTTPS.Agent({ rejectUnauthorized: false }); }

	return proxies.$;
};


export const getText = async (url, cookie, params, returnData = true) => {
	const response = await Axios.get(url, {
		params,
		responseType: 'text', headers: assignHeader(cookie),
		httpsAgent: getProxy(url)
	});

	return returnData ? response.data : response;
};


export const head = async (url, cookie) => {
	return await Axios.head(url, {
		responseType: 'text', headers: assignHeader(cookie),
		httpsAgent: getProxy(url)
	});
};

export const getJSON = async (url, cookie, params, returnData = true) => {
	const response = await Axios.get(url, {
		params,
		responseType: 'json', headers: assignHeader(cookie),
		httpsAgent: getProxy(url)
	});

	return returnData ? response.data : response;
};

export const postJSON = async (url, cookie, params, headers, returnData = true) => {
	const response = await Axios.post(url, params, {
		responseType: 'json', headers: Object.assign(assignHeader(cookie), headers),
		httpsAgent: getProxy(url)
	});

	return returnData ? response.data : response;
};


export const getStream = async (url, cookie, returnData = true) => {
	const response = await Axios.get(url, {
		responseType: 'stream', headers: assignHeader(cookie),
		httpsAgent: getProxy(url)
	});

	return returnData ? response.data : response;
};


export const getBuffer = async (url, cookie, returnData = true) => {
	const response = await Axios.get(url, {
		responseType: 'arraybuffer', headers: assignHeader(cookie),
		httpsAgent: getProxy(url)
	});

	return returnData ? response.data : response;
};