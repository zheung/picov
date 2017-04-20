(function() {
	d.s.on('list', function(result) {
		d.e.records.map(function(eRecord, i) {
			var record = result.records[i];

			eRecord.data('record', record);

			if(record) {
				var color = '#E0E2E4';

				if(record.multi) color = 'aqua';
				if(record.ugoira) color = 'violet';

				eRecord.find('.sTitle').html(record.title).attr('title', record.title).css('color', color);
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