
export default function() {
	BUS.dictIllust = {};

	W.add('stat', function(wock, iid, index, text) {
		let statIllust = BUS.dictIllust[iid];

		if(statIllust) {
			BUS.app.$set(statIllust, index, text);
		}
	});
	W.add('statDone', function(wock, iid) {
		let statIllust = BUS.dictIllust[iid];

		if(statIllust) {
			BUS.app.$set(statIllust, 'downCount', statIllust.downCount+1);
		}
	});
}