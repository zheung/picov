module.exports = async() => {
	let router = require('koa-router')();

	router.get('/', async(ctx, next) => {
		await next();

		ctx.body = await fs.readFileSync('./asset/html/index.html').toString();
	});
	router.get('/proxy/thumb', async(ctx, next) => {
		await next();

		let iid = ctx.query.iid, fr = ctx.query.fr, cached = await cache.has(iid);

		if(cached && !fr) {
			log('缓存', '小图', iid);
			ctx.type = 'image/png';
			ctx.body = fs.createReadStream(path.join(conf.path.cache, 'thumb', `${iid}.png`));
		}
		else {
			cache.set(iid, false);

			let thumbStream = await work.thumb(ctx.query), cacheStream = fs.createWriteStream(path.join(conf.path.cache, 'thumb', `${iid}.png`));

			cacheStream.on('finish', () => { cache.set(iid, true); });

			thumbStream.pipe(cacheStream);

			ctx.body = thumbStream;
		}
	});

	return router.routes();
};