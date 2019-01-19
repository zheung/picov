module.exports = function({ T }) {
	return async function({ uid }) {
		let user = (await T('get')(`https://www.pixiv.net/touch/ajax/user/details?id=${uid}`, 4)).user_details;

		return {
			follow: user.is_followed
		};
	};
};