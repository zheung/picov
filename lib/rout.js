module.exports = async() => {
	let router = require('koa-router')();

	router.get('/', async(ctx, next) => {
		await next();

		ctx.body = await fs.readFileSync('./asset/html/index.html').toString();
	});
	router.get('/list', async(ctx, next) => {
		let query = '';

		await next();

		if(ctx.originalUrl != ctx._matchedRoute)
			query = qs.parse(qs.unescape(ctx.originalUrl.replace('/list\?', '')));

		try {
			ctx.body = { s: true, now: ~~query.p, records: await work.list(query.p) } ;
		}
		catch(e) {
			log(e);

			ctx.body = { s: false };
		}
	});

	return router.routes();
};