module.exports = function($) {
	let { C, R } = $;

	let testFile = function(fileArr) {
		for(let file of fileArr) {
			try {
				_fs.statSync(file);

				return file;
			}
			catch(e) {
				continue;
			}
		}
	};

	return async function(raw, ctx) {
		let { iid, type, file, page } = raw;

		let path;
		let ext = _pa.parse(file).ext;

		if(type == 2) {
			path = testFile([
				R(C.path.large, String(iid), file),
				R(C.path.filed, String(iid), file),
			]);
		}
		else {
			path = testFile([
				R(C.path.large, `${iid}_p${page}${ext}`),
				R(C.path.filed, `${iid}_p${page}${ext}`),
				R(C.path.large, `${iid}_p${page}${ext}`),
				R(C.path.filed, `${iid}_p${page}${ext}`),
			]);
		}

		if(path) {
			return {
				_stat: 1,
				_type: ext,
				_data: _fs.createReadStream(path)
			};
		}
		else {
			ctx.status = 404;

			return {
				_stat: 2,
				_text: '文件不存在'
			};
		}
	};
};