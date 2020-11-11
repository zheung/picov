const PA = require('path');
const FS = require('fs');

const L = (console || {}).log;

global.__main = {
	dir: __dirname,
	R(...paths) { return PA.resolve(__main.dir, ...paths); }
};

const parseEntryJS = function(entry) {
	const template = FS.readFileSync(PA.resolve(__dirname, './font/index.tmplate.js'), 'utf8');

	const pathEntry = PA.relative(PA.resolve(__dirname, 'font'), PA.resolve(__dirname, 'apps', entry.__dir)).replace(/\\/g, '/');

	FS.writeFileSync(PA.resolve(__dirname, './font/index.js'), template.replace('$$', pathEntry));

	L('[App Entry]', pathEntry);
};
const loadSassResources = function(entry) {
	if(!(entry.sassResources instanceof Array)) { return []; }

	const sassResources = entry.sassResources.map(sr => PA.resolve(__dirname, 'apps', entry.__dir, sr));

	L('[App SassResources]', sassResources.join('; '));

	return sassResources;
};
const loadFavicon = function(entry) {
	if(!entry.favicon) { return null; }

	const favicon = PA.resolve(__dirname, 'apps', entry.__dir, entry.favicon);

	L('[App Favicon]', favicon);

	return favicon;
};
const loadResolveAlias = function(entry) {
	if(!(typeof entry.resolveAlias == 'object' && entry.resolveAlias)) { return {}; }

	const resolveAlias = Object
		.entries(entry.resolveAlias)
		.reduce((acc, [k, v]) => {
			acc[k] = PA.resolve(__dirname, 'apps', entry.__dir, v);

			L('[App ResolveAlias]', `${k} ==> ${acc[k]}`);
			
			return acc;
		}, {});

	return resolveAlias;
};


const aonfs = require('./libs/rout/aonfs')();
const entry = aonfs.find(aconf => (aconf.qonf || '').split('|').includes('entry'));


parseEntryJS(entry);
const sassResources = loadSassResources(entry);
const favicon = loadFavicon(entry);
const resolveAlias = loadResolveAlias(entry);

module.exports = { sassResources, favicon, resolveAlias };