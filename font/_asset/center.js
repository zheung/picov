
export default function() {
	BUS.dictIllust = {};

	W.add('stat', function(wock, iid, index, text) {
		if(BUS.dictIllust && BUS.dictIllust[iid]) {
			BUS.app.$set(BUS.dictIllust[iid], index, text);
			// BUS.aap.$forceUpdate();
		}
	});
}