//翻页
(function() {
	d.f.pageTurn = function(page) {
		d.s.emit('list', { p: (typeof page == 'number' && page ? page : 1) });
	};

	d.f.save = function() {
		var $this = $(this), record = $this.data('record');

		if(!~~record.ugoira)
			d.s.emit('save', { iid: record.iid, time: record.time });

		// window.open('https://www.pixiv.net/member_illust.php?mode='+(~~data.multi ? 'manga': 'medium')+'&illust_id='+data.iid);
	};

	d.f.log = function(text, id_) {
		var box = d.e.sLogBox, ts = box.children(), id = 'log-'+id_, span = ts.filter('#'+id);

		if(span.length)
			span.html(text);
		else {
			box.append($('<span>').attr('id', id).html(text));

			if(ts.length+1 > 34)
				ts.filter(':first').remove();
		}
	};
})();