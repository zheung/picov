
export default function() {
	W.add('stat', function(wock, iid, index, text) {
		if(BUS.dictFollow && BUS.dictFollow[iid]) {
			BUS.app.$set(BUS.dictFollow[iid], index, text);
		}
		if(BUS.dictSearch && BUS.dictSearch[iid]) {
			BUS.app.$set(BUS.dictSearch[iid], index, text);
		}
		if(BUS.dictAuthor && BUS.dictAuthor[iid]) {
			BUS.app.$set(BUS.dictAuthor[iid], index, text);
		}
	});
}