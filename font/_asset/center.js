
export default function() {
	BUS.dictIllust = {};

	W.add('stat', function(wock, iid, index, text) {
		let statIllust = BUS.dictIllust[iid];

		if(statIllust) {
			BUS.app.$set(statIllust, index, text);

			// if(index == 'statL' && statIllust.type == 2 && (text.indexOf('完成') + 1)) {
			// 	BUS.changeViewer(statIllust);
			// }
		}
	});
	W.add('statDone', function(wock, iid) {
		let statIllust = BUS.dictIllust[iid];

		if(statIllust) {
			BUS.app.$set(statIllust, 'downCount', statIllust.downCount + 1);
		}
	});
}