module.exports = function({ G, C, Request }) {
	return async function(form = {}, useProxy = true) {
		return new Promise(function(resolve, reject) {
			let option = {
				url: 'https://api.e-hentai.org/api.php',
				method: 'POST',

				form: JSON.stringify(form),

				proxy: useProxy ? C.proxy : null
			};

			G.trace('请求', 'epost');

			Request(option, function(error, response, text) {
				if(error) {
					reject(error);
				}
				else {
					resolve(JSON.parse(text));
				}
			});
		});
	};
};