module.exports = {
// 默认配置
	serv: {
		host: '0.0.0.0',
		port: 80
	},
// 是否使用http协议，默认true。false则启用http2模块
	http1: true,
// 应用加载模式。1、根据参数的单应用；2、多应用，subs下所有+extra
	loadMode: 1,
// 指明额外应用的路径
	extraSubs: [],
// 输出请求
	logResponse: true
};