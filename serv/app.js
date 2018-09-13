(async function() {
	try {
// 初始化全局变量
		await require('./libs/init')();

		let servType = process.argv[2];
// 启动模式
		if(C.loadMode == 2) {
			await require('./libs/serv')();
		}
		else if(typeof servType == 'string') {
			await require('./libs/serv')(servType);
		}
		else {
			LE('错误：缺少参数[子应用名]，启动中止');
		}
	}
	catch(e) {
		(console || 0).error(e.stack);
	}
})();