module.exports = async() => {
	let router = require('koa-router')();

	router.get('/', async(ctx, next) => {
		await next();

		ctx.body = await fs.readFileSync('./asset/html/index.html').toString();
	});
	router.get('/list', async(ctx, next) => {
		let query = {};

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
	router.get('/thumb', async(ctx, next) => {
		await next();

		let q = {};

		if(ctx.originalUrl != ctx._matchedRoute)
			q = qs.parse(qs.unescape(ctx.originalUrl.replace('/thumb\?', '')));

		ctx.body = await func.get(`https://i.pximg.net/c/150x150/img-master/img/${q.time}/${q.iid}${~~q.ugoira ? '' : '_p0'}_master1200.jpg`, 2);
	});

	return router.routes();
};