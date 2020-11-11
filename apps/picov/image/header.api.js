const PA = require('path');
const FS = require('fs');

const C = require('../../../libs/conf')('server');
const Profile = require('../../../libs/profile');

const { getJSONChain, getStream } = require('../api.api');

module.exports = function() {
	return {
		async c(raw) {
			const P = Profile(raw.who);

			let pathFile;

			if((pathFile = FS.readdirSync(C.path.temp).find(fn => fn.includes(`header-${P.id}.`)))) {
				pathFile = PA.resolve(C.path.temp, pathFile);

				throw [4, FS.createReadStream(pathFile), PA.parse(pathFile).ext];
			}

			const url = await getJSONChain('https://www.pixiv.net/touch/ajax/user/self/status', P.cookie, 'body.user_status.profile_img.main');
			const ext = PA.parse(url).ext;
			pathFile = PA.resolve(C.path.temp, `header-${P.id}${ext}`);

			const streamSend = await getStream(url, P.cookie);
			const streamSave = FS.createWriteStream(pathFile);

			await new Promise(function(resolve) {
				streamSave.on('finish', () => resolve());

				streamSend.pipe(streamSave);
			});

			throw [4, FS.createReadStream(pathFile), ext];
		},
	};
};