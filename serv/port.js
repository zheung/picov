module.exports = async function(servType, conf) {
	try {
// 初始化全局变量
		await require('./libs/init')();

// 启动模式
		if(typeof servType == 'string') {
			await require('./libs/serv')(servType, conf);
		}
		else {
			LE('错误：缺少参数[子应用名]，启动中止');
		}
	}
	catch(e) {
		(console || 0).error(e.stack);
	}
};