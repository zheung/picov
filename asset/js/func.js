(function() {

	d.f.save = function() {
		var $this = $(this), record = $this.data('record');

		if(~~record.ugoira)
			window.open('https://www.pixiv.net/member_illust.php?mode=medium&illust_id='+record.iid);
		else
			d.s.emit('save', { iid: record.iid, time: record.time });
	};

	d.f.clear = function() {
		$('.sLogBox>span:not(#log-CountProc)').remove();
	};

})();