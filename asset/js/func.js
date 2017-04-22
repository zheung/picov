(function() {
	d.f.turn = function(page) {
		d.s.emit(d.v.meanNow, d.f.params(page));
	};
	d.f.search = function(word) {
		d.v.wordNow = typeof word == 'string' ? word : d.e.Word.val();
		d.v.meanNow = 'listSearch';

		d.f.turn(1);
	};

	d.f.save = function() {
		var $this = $(this), record = $this.data('record');

		if(~~record.ugoira)
			window.open('https://www.pixiv.net/member_illust.php?mode=medium&illust_id='+record.iid);
		else
			d.s.emit('save', { iid: record.iid, time: record.time });
	};

	d.f.log = function(text, id_) {
		var box = d.e.sLogBox, ts = box.children(), id = 'log-'+id_, span = ts.filter('#'+id);

		if(id_ && span.length)
			span.html(text);
		else {
			box.append($('<span>').attr('id', id).html(text));

			if(ts.length+1 > 77)
				ts.filter(':first').remove();
		}
	};

	d.f.clear = function() {
		$('.sLogBox>span').remove();
	};

	d.f.params = function(page) {
		var mean = d.v.meanNow;

		if(mean == 'listFollow')
			return {
				p: (~~page > 0 ? ~~page : 1)
			};
		else if(mean == 'listSearch')
			return {
				p: (~~page > 0 ? ~~page : 1),
				w: d.v.wordNow,
			};
	};
})();