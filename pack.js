let fs = require('fs');
let L = (console || 0).log;

let archiver = require('archiver');
let moment = require('moment');

let output = fs.createWriteStream(__dirname + `/picov.${moment().format('YYMMDD')}.zip`);
let archive = archiver('zip', {
	zlib: { level: 9 }
});

output.on('close', function() {
	L(archive.pointer() + ' total bytes');
});

archive.pipe(output);

archive.directory('build', 'plus_unip');

archive.finalize();