export default function(bus, x) {
	x.wins = {
		init: function(id, component) {
			let comp = Vue.component(id);

			if(!comp && component) {
				comp = Vue.component(id, component);
			}

			return comp;
		},
		show: function(comp, title, conf) {
			let winConf = X.comp('win');

			winConf.comp = comp;
			winConf.title = title;
			winConf.conf = conf;
			winConf.show = true;
		},
		hide: function() {
			X.comp('win').show = false;
			Vue.set(X.comp('Masker'), 'mask', 0);
		}
	};
}