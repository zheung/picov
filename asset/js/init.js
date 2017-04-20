(function() {
	d.t.pager('record', d.e.RecordPrev, d.e.RecordNext, function(pager) { d.e.RecordPage.val(pager.now); }, null, d.f.pageTurn);
	d.t.taber('RightNavi', d.e.TabHeadRightNavi, d.e.TabItemRightNavi, ['Basic', 'Config', 'About'], 'active');

	d.e.Search.on('click', d.f.pageTurn);

	$('.Record').on('dblclick', d.f.save);
	$('.Clear').on('click', function() {
		$('.sLogBox>span').remove();
	});
})();

(function() {
	d.e.RecordPage.on('keyup', function(e) {
		if(e.keyCode == 13) d.f.pageTurn(d.e.RecordPage.val());
	});
	$(document).on('keyup', function(e) {
		var ae = document.activeElement;

		if(ae.type == 'input' || ae.type == 'textarea') {
			if(ae === d.e.Search[0] && e.keyCode == 13) {
				d.e.Search.click();

				return false;
			}

			return true;
		}
		else if(ae == d.e.RecordPage[0]) {
			if(e.keyCode == 13) {
				d.f.pageTurn(d.e.RecordPage.val());
				d.e.RecordPage.blur();

				return false;
			}
		}
		else {
			if(e.keyCode == 65 || e.keyCode == 33 || e.keyCode == 74) { d.e.RecordPrev.click(); return false; }
			else if(e.keyCode == 68 ||e.keyCode == 34 || e.keyCode == 75) { d.e.RecordNext.click(); return false; }
			else if(e.keyCode == 67 && e.shiftKey) {
				$('.sLogBox>span').remove();

				return false;
			}
			else if(e.keyCode == 71 && e.shiftKey) {
				d.e.RecordPage.focus();

				return false;
			}
		}
	});
})();

// Init
(function() {
	d.e.Search.click();
	d.e.TabHeadRightNavi.first().click();
})();