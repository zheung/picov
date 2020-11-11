const Axios = require('axios');

const Proxy = require('../../libs/proxy');
const C = require('../../libs/conf')('server');

const optchain = require('../../tools/optchain');

const getJSON = async function(url, cookie, returnData = true) {
	const response = await Axios.get(url, {
		responseType: 'json',
		headers: Object.assign({ Cookie: `PHPSESSID=${cookie}` }, C.headers),
		httpsAgent: Proxy(C.proxies.api)
	});

	return returnData ? response.data : response;
};

const getStream = async function(url, cookie, returnData = true) {
	const response = await Axios.get(url, {
		responseType: 'stream',
		headers: Object.assign({ Cookie: `PHPSESSID=${cookie}` }, C.headers),
		httpsAgent: Proxy(C.proxies.api)
	});

	return returnData ? response.data : response;
};

const getJSONChain = async function(url, cookie, chain, cb) {
	return optchain(await getJSON(url, cookie), chain, cb);
};

module.exports = { getJSON, getStream, getJSONChain };