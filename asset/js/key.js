(function() {
	$(document).on('keyup', function(e) {
		var ae = document.activeElement, tagName = ae.tagName.toLowerCase();

		if(tagName == 'input' || tagName == 'textarea') {
			if(e.keyCode == 13) {
				if(ae === d.e.Word[0]) {
					d.e.Search.click();

					return false;
				}
				else if(ae == d.e.RecordPage[0]) {
					d.f.turn(d.e.RecordPage.val());
					d.e.RecordPage.blur();

					return false;
				}
			}

			return true;
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