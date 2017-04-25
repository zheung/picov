// 固定主界面宽度
(function() {
	var resizer = function() {
		$('.Main').width(document.body.clientWidth-450);
		$('.TabItem.RightNavi').height(document.body.clientHeight-45);
	};

	$(window).resize(resizer);
	resizer();
})();
// 复制条目Div
(function() {
	var eRecords = $('.Records'), eRecord = eRecords.children('.Record'),
		records = [$(eRecord)], record;

	for(var i=2; i<=20; i++) {
		record = eRecord.clone();

		eRecords.append(record);
		records.push($(record));
	}

	d.e.records = records;
})();
// 功能Div入库
(function() {
	d.s = io();

	d.e.Search = $('#Search');

	d.e.sMean = $('.sMean');
	d.e.sLogBox = $('.sLogBox');
	d.e.sTagBox = $('.sTagBox');

	d.e.RecordPrev = $('#RecordPrev');
	d.e.RecordNext = $('#RecordNext');
	d.e.RecordPage = $('#RecordPage');

	d.e.Word = $('#Word');

	d.e.TabHeadRightNavi = $('.TabHead.RightNavi');
	d.e.TabItemRightNavi = $('.TabItem.RightNavi');
})();