(function() {
	app.io.on('list', function(result) {
		app.list = result.records;
		app.pageNow = result.now;
		app.mean = result.mean;
	});

	app.io.emit('listFollow', { p:1 });

	d.s.on('log', d.f.log);

	d.s.on('listTag', function(list) {
		var box = d.e.sTagBox;

		list.map(function(tag) {
			box.append($('<span>').html(tag[0]).addClass('tagLike').data('tagWord', tag[1]).on('click', d.f.searchByTagLike));
		});
	});
})();