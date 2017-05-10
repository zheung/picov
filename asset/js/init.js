(function() {
	$('.Record').on('dblclick', d.f.save);
	$('.Clear').on('click', d.f.clear);
	$('.PageFollow').on('click', d.f.pageFollow);

	$('.sThumb').bind('error', function() {
		var src = this.src;

		if(!/fr=/.test(src)) {
			this.src = src.replace(/\?/, '?fr=1&');
		}
	});
})();