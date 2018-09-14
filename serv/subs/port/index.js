module.exports = async function($, router) {
	await $.st(await $.pa('dist'), { defer: true });
	// await $.st(J($.conf.pathArch, 'Image'), { defer: false }, '/reso');

	await $.rq('../../../initWork');

	$.app.use(async function(ctx, next) {
		let raw = ctx.raw || {};

		raw.token = ctx.cookies.get('token') || raw.token;
		raw._ip = ctx.ip;

		ctx.raw = raw;

		await next();
	});

	let os = require('os');
	let dest = J(os.tmpdir(), 'picov');

	try {
		_fs.mkdirSync(dest);
	} catch (error) { true; }

	let multer = require('koa-multer')({ dest });

	let flows = await require(await $.pa('libs/flow'))($);

	for(let flow of flows) {
		if(flow.type == 3) {
			router[flow.method]('uapi/'+flow.path, multer.any());
		}

		router[flow.method]('uapi/'+flow.path, async function(ctx, next) {
			await next();

			let raw = ctx.raw;

			let files = ctx.req.files;

			if(ctx.req.body) {
				for(let key in ctx.req.body) {
					raw[key] = ctx.req.body[key];
				}
			}

			if(files) {
				raw._files = files;
			}

			let result = await flow.flower(ctx.raw);

			if(flow.type != 4) {
				if(result.type) {
					ctx.type = result.type;
				}
				else {
					ctx.type = 'json';
				}

				ctx.body = result;
			}
			else {
				let mime = !!result.data.mime;

				if(result.data && result.data.data && result.data.data.length) {
					for(let url of result.data.data) {
						if(url.startsWith('http')) {
							try {
								ctx.body = (await Request.get({
									url: url,
									responseType:'stream'
								})).data;

								ctx.attachment(_pa.parse(url).base);

								break;
							}
							catch(e) {
								continue;
							}
						}
						else {
							try {
								let stat = _fs.statSync(url);

								ctx.lastModified = new Date(stat.mtime);

								if(mime) {
									ctx.type = _pa.parse(url).ext;
								}
								else {
									ctx.attachment(_pa.parse(url).base);
								}

								ctx.body = _fs.createReadStream(url);

								break;
							}
							catch(e) {
								continue;
							}
						}
					}
				}
				else {
					ctx.status = 404;
				}
			}
		});
	}
};