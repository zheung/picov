const PA = require('path');
const FS = require('fs');

const C = require('../../../libs/conf')('server');
const Profile = require('../../../libs/profile');

const { getStream } = require('../api.api');

module.exports = function() {
	return {
		async c(raw) {
			const P = Profile(raw.who);

			const { iid, time, type, square } = raw;

			let pathFile;

			const typeSquare = square ? 'square' : 'master';

			if((pathFile = FS.readdirSync(C.path.temp).find(fn => fn.includes(`thumb-${typeSquare}-${iid}.`)))) {
				pathFile = PA.resolve(C.path.temp, pathFile);

				throw [4, FS.createReadStream(pathFile), PA.parse(pathFile).ext];
			}

			const url = `https://i.pximg.net/c/150x150/img-master/img/${time}/${iid}${~~type == 2 ? '' : '_p0'}_${typeSquare}1200.jpg`;
			const ext = PA.parse(url).ext;
			pathFile = PA.resolve(C.path.temp, `thumb-${typeSquare}-${iid}${ext}`);

			const streamSend = await getStream(url, P.cookie);
			const streamSave = FS.createWriteStream(pathFile);

			await new Promise(function(resolve) {
				streamSave.on('finish', () => resolve());

				streamSend.pipe(streamSave);
			});

			throw [4, FS.createReadStream(pathFile), ext];
		}
	};
};