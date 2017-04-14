module.exports = async() => {
	let Koa = require('koa'), app = new Koa();

	app.use(require('koa-compress')({ threshold: 2048, flush: require('zlib').Z_SYNC_FLUSH }));
	app.use(require('koa-bodyparser')());
	app.use(require('koa-static')('./asset'));

	app.use(await require('./rout.js')());

	http.createServer(app.callback()).listen(910);

	try {
		let env = process.env,
			uid = parseInt(env['SUDO_UID'] || process.getuid(), 10),
			gid = parseInt(env['SUDO_GID'] || process.getgid(), 10);

		process.setgid(gid);
		process.setuid(uid);
	}
	catch(e) { true; }

	log('server started');
};