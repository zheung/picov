const HttpsProxyAgent = require('https-proxy-agent');

const proxies = {};

module.exports = function(url) {
	return url ? (proxies[url] ? proxies[url] : (proxies[url] = new HttpsProxyAgent(url))) : null;
};