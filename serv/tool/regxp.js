module.exports = {
	tmpl: function(name, flag = 'g') {
		return new RegExp(`\\$\\{${name}\\}`, flag);
	}
};