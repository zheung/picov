(function() {
	d.t.pager('record', d.e.RecordPrev, d.e.RecordNext, function(pager) { d.e.RecordPage.val(pager.now); }, null, d.f.turn);
	d.t.taber('RightNavi', d.e.TabHeadRightNavi, d.e.TabItemRightNavi, ['Basic', 'Like', 'About'], 'active');

	d.e.Search.on('click', d.f.search);

	$('.Record').on('dblclick', d.f.save);
	$('.Clear').on('click', d.f.clear);
	$('.PageFollow').on('click', d.f.pageFollow);

	$('.sThumb').bind('error', function() {
		var src = this.src;

		if(!/fr=/.test(src)) {
			this.src = src.replace(/\?/, '?fr=1&');
		}
	});

	d.t.swier('isR18', d.e.R18, ['全年龄', 'R18']);
})();

// Init
(function() {
	d.v.meanNow = 'listFollow';
	d.f.turn(1);

	d.s.emit('listTag');

	d.e.TabHeadRightNavi.first().click();
})();