//翻页
(function() {
	d.f.pageTurn = function(page) {
		d.t.get('list', { p: (typeof page == 'number' && page ? page : 1) }, function(obj) {
			d.e.records.map(function(eRecord, i) {
				var record = obj.records[i];

				eRecord.data('record', record);

				if(record) {
					eRecord.find('.sTitle').html(record.title).attr('title', record.title);
					eRecord.find('.sUser').html(record.user);
					eRecord.find('.sThumb').data('iid', record.iid).data('mode', ~~record.multi ? 'manga': 'medium')
						.attr('src', '').attr('src', '/thumb?iid='+record.iid+'&time='+record.time+'&ugoira='+record.ugoira)
					;
				}

				eRecord.children()[record ? 'removeClass' : 'addClass']('hide');
				eRecord[record ? 'removeClass' : 'addClass']('hidden');
			});

			d.t.pagerDeal(obj.now, null, d.v.pager['record']);
		});
	};
})();
(function() {
	d.f.open = function() {
		var $this = $(this), data = $this.data();

		window.open('https://www.pixiv.net/member_illust.php?mode='+data.mode+'&illust_id='+data.iid);
	};
})();