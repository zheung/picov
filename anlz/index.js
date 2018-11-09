module.exports = function($) {
	let { J } = $;

	let list = _fs.readdirSync(J('anlz'));
	let anlzs = {};

	for(let fileName of list) {
		let name = _pa.parse(fileName).name;
		if(name != 'index') {
			anlzs[name] = require(J('anlz', name))($);
		}
	}

	return anlzs;
};