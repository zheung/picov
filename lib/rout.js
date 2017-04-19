module.exports = async() => {
	let router = require('koa-router')();

	router.get('/', async(ctx, next) => {
		await next();

		ctx.body = await fs.readFileSync('./asset/html/index.html').toString();
	});
	router.get('/list', async(ctx, next) => {
		await next();

		let q = ctx.query;

		try {
			ctx.body = { s: true, now: ~~q.p, records: await work.list(q.p) } ;
		}
		catch(e) {
			log(e);

			ctx.body = { s: false };
		}
	});
	router.get('/thumb', async(ctx, next) => {
		await next();

		let iid = ctx.query.iid, cached = await cache.has(iid);

		if(cached) {
			log('缓存', '小图', iid);
			ctx.type = 'image/png';
			ctx.body = fs.createReadStream(`cache/${iid}.png`);
		}
		else {
			let thumbStream = await work.thumb(ctx.query), cacheStream = fs.createWriteStream(`cache/${iid}.png`);

			cacheStream.on('end', () => { cache.set(iid, true); });

			thumbStream.pipe(cacheStream);

			ctx.body = thumbStream;
		}
	});
	router.get('/save', async(ctx, next) => {
		await next();

		work.save(ctx.query.iid, ctx.query.time);

		ctx.body = { s: true };
		// ctx.body = { s: true, count: await work.save(q.iid, q.time, !!ctx.query.multi) };
	});

	return router.routes();
};