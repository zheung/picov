(function() {
	d.t.pagerDeal = function(now, max, pager) {
		var eNow = pager.eNow, eMax = pager.eMax;

		if(eNow && typeof now == 'number') {
			pager.now = now;

			if(typeof eNow == 'function') eNow(pager);
			if(typeof eNow == 'object') eNow.html(now);
		}

		if(eMax && typeof max == 'number') {
			pager.max = max;

			if(typeof eMax == 'function') eMax(pager);
			if(typeof eMax == 'object') eMax.html(max);
		}

		if(pager.edge) {
			pager.ePrev[now == 1 ? 'addClass' : 'removeClass'](pager.edge);
			pager.eNext[now == max && eMax ? 'addClass' : 'removeClass'](pager.edge);
		}
	};

	var clicker = function() {
		var $this = $(this), data = $this.data(),
			key = data.pagerKey, pager = d.v.pager[key], page = pager.now + data.pagerOffset;
		if(pager && pager.turn && page > 0 && (page <= pager.max || !pager.eMax)) pager.turn(page);
	};

	d.v.pager = {};

	d.t.pager = function(key, ePrev, eNext, eNow, eMax, turn, now, max, edgeClass) {
		ePrev.on('click', clicker).data('pagerKey', key).data('pagerOffset', -1);
		eNext.on('click', clicker).data('pagerKey', key).data('pagerOffset', 1);

		d.v.pager[key] = {
			now: now || 0, max: max || 0,
			ePrev: ePrev, eNext: eNext,
			eNow: eNow, eMax: eMax,
			turn: turn, edge: edgeClass
		};
	};
})();