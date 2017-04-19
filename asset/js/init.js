(function() {
	d.t.pager('record', d.e.RecordPrev, d.e.RecordNext, function(pager) { d.e.RecordPage.val(pager.now); }, null, d.f.pageTurn);
	d.t.taber('RightNavi', d.e.TabHeadRightNavi, d.e.TabItemRightNavi, ['Basic', 'Config', 'About'], 'active');

	d.e.Search.on('click', d.f.pageTurn);

	$('.Record').on('dblclick', d.f.open);
})();

// Init
(function() {
	d.e.Search.click();
	d.e.TabHeadRightNavi.first().click();
})();