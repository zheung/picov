module.exports = async() => {
	let router = require('koa-router')();

	router.get('/proxy/thumb', async(ctx, next) => {
		await next();

		let iid = ctx.query.iid, fr = ctx.query.fr, cached = await cache.has(iid);

		if(cached && !fr) {
			L('缓存', '小图', iid);
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
	router.get('/down', async(ctx, next) => {
		await next();

		let iid = ctx.query.iid;

		let coll = db.coll('illust');

		let stat = await coll.getStatOne(iid);

		if(stat.ding)
			ctx.body = `拒绝 ${iid} 正在下载`;
		else if(stat.down)
			ctx.body = `拒绝 ${iid} 已经下载`;
		else {
			stat.ding = true;

			await work.save(iid, soger());

			await coll.updateOne(stat);

			stat.down = true;
			stat.ding = false;

			ctx.body = `${iid} 成功下载`;
		}
	});
	router.get('/downJSON', async(ctx, next) => {
		await next();

		let ids = require('../last.json');

		let coll = db.coll('illust');

		let stats = await coll.getStatByIds(ids);

		for(let iid of ids) {
			let stat = stats[iid];

			if(stat.ding)
				L(`拒绝 ${iid} 正在下载`);
			else if(stat.down)
				L(`拒绝 ${iid} 已经下载`);
			else {
				stat.ding = true;

				await coll.updateOne(stat);

				await work.save(iid, soger());

				stat.down = true;
				stat.ding = false;

				await coll.updateOne(stat);

				L(`${iid} 成功下载`);
			}
		}
	});

	return router.routes();
};