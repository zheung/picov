(function() {
	d.t.pager('record', d.e.RecordPrev, d.e.RecordNext, function(pager) { d.e.RecordPage.val(pager.now); }, null, d.f.turn);
	d.t.taber('RightNavi', d.e.TabHeadRightNavi, d.e.TabItemRightNavi, ['Basic', 'Config', 'About'], 'active');

	d.e.Search.on('click', d.f.search);

	$('.Record').on('dblclick', d.f.save);
	$('.Clear').on('click', d.f.clear);
})();

(function() {
	$(document).on('keyup', function(e) {
		var ae = document.activeElement, tagName = ae.tagName.toLowerCase();

		if(tagName == 'input' || tagName == 'textarea') {
			if(ae === d.e.Word[0] && e.keyCode == 13) {
				d.e.Search.click();

				return false;
			}

			return true;
		}
		else if(ae == d.e.RecordPage[0]) {
			if(e.keyCode == 13) {
				d.f.turn(d.e.RecordPage.val());
				d.e.RecordPage.blur();

				return false;
			}
		}
		else {
			if(e.keyCode == 65 || e.keyCode == 33 || e.keyCode == 74) { d.e.RecordPrev.click(); return false; }
			else if(e.keyCode == 68 ||e.keyCode == 34 || e.keyCode == 75) { d.e.RecordNext.click(); return false; }
			else if(e.keyCode == 67 && e.shiftKey) {
				d.f.clear();

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
	d.v.meanNow = 'listFollow';
	d.f.turn(1);

	d.e.TabHeadRightNavi.first().click();
})();