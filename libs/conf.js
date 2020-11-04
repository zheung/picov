const PA = require('path');

module.exports = async function(type = null, pathDir = PA.parse(require.main.filename).dir) {
	const nameFile = type ? `config.${type}.js` : 'config.js';

	const confRaw = require(PA.resolve(pathDir, nameFile));

	const C = typeof confRaw == 'function' ? (await confRaw()) : confRaw;

	C.__name = nameFile;
	C.__fold = pathDir;

	return C;
};