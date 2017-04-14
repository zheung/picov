module.exports = async() => {
	let router = require('koa-router')();

	router.get('/', async(ctx, next) => {
		await next();

		ctx.body = fs.readFileSync('./asset/html/login.html').toString();
	});

	return router.routes();
};