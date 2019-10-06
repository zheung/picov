module.exports = function($) {
	let { T, C, Moment } = $;
	let JSZip = require('jszip');

	const categorys = {
		Doujinshi: 1,
		Manga: 2,
		'Artist CG': 3,
		'Game CG': 4,
		'Western': 5,
		'Non-H': 6,
		'Image Set': 7,
		Cosplay: 8,
		'Asian Porn': 9,
		Misc: 10
	};

	return {
		async c(raw) {
			let { id, token } = raw;

			if(!/^[1-9]\d*$/.test(id) || !/^[A-Za-z0-9]+$/.test(token)) {
				throw '参数不正确';
			}
		},
		async m({ id, token }, conn, query) {
			let { fileSize, title } = (await conn.queryOne('SELECT "fileSize", title FROM exhentai.gallery WHERE id=$ AND TOKEN=$', [id, token])) || {};

			if(!fileSize) {
				let gallery = (await T.epost({
					method: 'gdata',
					gidlist: [
						[id, token]
					],
					namespace: 1
				})).gmetadata[0];

				fileSize = gallery.filesize;
				title = gallery.title;

				let info = {
					id: gallery.gid,
					token: gallery.token,

					title: gallery.title,
					titleJapan: gallery.title_jpn,

					category: categorys[gallery.category],

					fileSize: gallery.filesize,
					fileCount: gallery.filecount,

					timePost: Moment(gallery.posted, 'X').format(),
					archiverKey: gallery.archiver_key,

					tagLanguage: [],
					tagParody: [],
					tagCharacter: [],
					tagGroup: [],
					tagArtist: [],
					tagFemale: [],
					tagMale: [],
					tagMisc: [],
					tagReclass: [],
				};

				for(let tag_ of gallery.tags) {
					let [tag, namespace = 'Misc'] = tag_.split(':').reverse();

					if(tag == 'translated' && namespace == 'language') {
						info.isTranslated = true;
					}

					info[`tag${namespace.replace(/^./, c => c.toUpperCase())}`].push(tag);
				}

				await query('INSERT INTO exhentai.gallery$i', [info]);
			}

			let exist = false;
			let same = false;
			let badFiles = [];

			for(let dirPath of C.path.gallery) {
				try {
					let filePath = R(dirPath, `${title.replace(/[|]/g, '').replace(/[~]/g, '_')}.zip`);
					let data = _fs.readFileSync(filePath);

					exist = true;

					let zip = await JSZip.loadAsync(data);
					let realSize = 0;
					zip.forEach((relativePath, file) => {
						realSize += file._data.uncompressedSize;
					});

					if(fileSize == realSize) {
						same = true;
					}
					else {
						badFiles.push({
							path: filePath,
							uncompressedSize: realSize
						});
					}
				}
				catch(error) {
					if(error.code != 'ENOENT') {
						throw error;
					}
				}
			}

			return {
				same,
				exist,
				title,
				size: fileSize,
				badFiles: badFiles
			};
		}
	};
};