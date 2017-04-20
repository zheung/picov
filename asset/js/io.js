(function() {
	d.s.on('list', function(result) {
		d.e.records.map(function(eRecord, i) {
			var record = result.records[i];

			eRecord.data('record', record);

			if(record) {
				var title = (record.ugoira?'[U]':'')+(record.multi?'[M]':'')+record.title;

				eRecord.find('.sTitle').html(title).attr('title', record.title);
				eRecord.find('.sUser').html(record.user);
				eRecord.find('.sThumb').attr('src', '').attr('src', '/thumb?iid='+record.iid+'&time='+record.time+'&ugoira='+record.ugoira);
			}

			eRecord.children()[record ? 'removeClass' : 'addClass']('hide');
			eRecord[record ? 'removeClass' : 'addClass']('hidden');
		});

		d.e.sMean.html('当前列表：'+result.mean);
		d.t.pagerDeal(result.now, null, d.v.pager['record']);
	});

	d.s.on('log', d.f.log);
})();