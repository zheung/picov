module.exports = function(name) {
// 指定加载某一工具
	return require(JD('tool', name));
};