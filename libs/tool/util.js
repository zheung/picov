let util = {
	// 用于判断变量类型
	isType: function(vari, ins) {
		if(vari && typeof vari == 'object' && vari instanceof ins) {
			return true;
		}
		else {
			return false;
		}
	},

	// 用于判断变量类型
	isObj: function(vari) {
		if(vari && typeof vari == 'object') {
			return true;
		}
		else {
			return false;
		}
	},

	// 判断是否数组
	isArray: function(vari) {
		return util.isType(vari, Array);
	},

	// 判断是否字符串
	isStr: function(vari) {
		if(vari && (typeof vari == 'string' || vari instanceof String)) {
			return true;
		}
		else {
			return false;
		}
	},
};

module.exports = function() {
	return util;
};