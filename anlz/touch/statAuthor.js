module.exports = function({ T }) {
	return async function({ uid }) {
		let raw = await T.get(`https://www.pixiv.net/touch/ajax/user/details?id=${uid}`, 4);
		let user = raw.body.user_details;

		return {
			follow: user.is_followed
		};
	};
};