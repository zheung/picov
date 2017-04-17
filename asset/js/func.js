//翻页
(function() {
	d.f.pageTurn = function(page) {
		d.t.get('list', { p: (typeof page == 'number' && page ? page : 1) }, function(obj) {
			d.e.records.map(function(eRecord, i) {
				var record = obj.records[i];

				eRecord.data('record', record);

				if(record) {
					eRecord.find('.sTitle').html(record.title);
					eRecord.find('.sUser').html(record.user);
					// eRecord.find('.sUser').attr('href', 'http://'+record.domn[0]);
				}

				eRecord.children()[record ? 'removeClass' : 'addClass']('hide');
				eRecord[record ? 'removeClass' : 'addClass']('hidden');
			});

			d.t.pagerDeal(obj.now, null, d.v.pager['record']);
		});
	};
})();