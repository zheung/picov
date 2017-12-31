(function() {
	var isInput =function(tagName) {
			return tagName == 'input' || tagName == 'textarea';
		},
		inArr =function(code, arr) {
			for(var i in arr)
				if(arr[i] == code)
					return true;

			return false;
		};

	window.keyInit = function() {
		document.addEventListener('keyup', function(e) {
			var ae = document.activeElement, tagName = ae.tagName.toLowerCase();

			if(!isInput(tagName)) {
				if(inArr(e.keyCode, [65,33,74])) { app.turn(app.pageNow, -1); return false; } //a, pup, j
				else if(inArr(e.keyCode, [68,34,75])) { app.turn(app.pageNow, 1); return false; } //d, pdn, k
				else if(e.keyCode == 67 && e.shiftKey) { //c
					app.clear();

					return false;
				}
				else if(e.keyCode == 71 && e.shiftKey) { //g
					app.$refs.pager.focus();

					return false;
				}
				else if(e.keyCode == 83 && e.shiftKey) { //s
					app.$refs.worder.focus();

					return false;
				}
				else if(e.keyCode == 69) { //e
					app.downloadAll();

					return false;
				}
			}
		});
	};
})();