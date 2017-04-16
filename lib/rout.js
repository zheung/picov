module.exports = async() => {
	let router = require('koa-router')();

	router.get('/', async(ctx, next) => {
		await next();

		ctx.body = await fs.readFileSync('./asset/html/index.html').toString();
	});
	router.get('/list', async(ctx, next) => {
		let query = '';

		await next();

		if(this.originalUrl != this._matchedRoute)
			query = qs.parse(qs.unescape(this.originalUrl.replace('/kq/q\?', '')));

		ctx.body = await work.list(query.p);
	});

	return router.routes();
};