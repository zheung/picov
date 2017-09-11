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

		let iid = ctx.query.iid, dictDing = global.dictDing, dictDown = global.dictDown;

		if(dictDing[iid])
			ctx.body = `拒绝 ${iid} 正在下载`;
		else if(dictDown[iid])
			ctx.body = `拒绝 ${iid} 已经下载`;
		else {
			dictDing[iid] = true;

			await work.save(iid, soger());

			fs.writeFileSync('./dictDown.json', JSON.stringify(dictDown));

			dictDown[iid] = true;

			delete dictDing[iid];

			fs.writeFileSync('./dictDing.json', JSON.stringify(dictDing));

			ctx.body = `${iid} 成功下载`;
		}
	});
	router.get('/downJSON', async(ctx, next) => {
		await next();

		let dictDing = global.dictDing, dictDown = global.dictDown, ids = require('../last.json');

		for(let iid of ids) {
			if(dictDing[iid])
				L(`拒绝 ${iid} 正在下载`);
			else if(dictDown[iid])
				L(`拒绝 ${iid} 已经下载`);
			else {
				dictDing[iid] = true;

				await work.save(iid, soger());

				fs.writeFileSync('./dictDown.json', JSON.stringify(dictDown));

				dictDown[iid] = true;

				delete dictDing[iid];

				fs.writeFileSync('./dictDing.json', JSON.stringify(dictDing));

				L(`${iid} 成功下载`);
			}
		}
	});

	return router.routes();
};