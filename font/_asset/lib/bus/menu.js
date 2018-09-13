export default function(bus, x) {
	x.menu = function(menu, event) {
		let conf = X.comp('menus');

		if(typeof menu == 'object' && menu) {
			conf.data = menu;
		}

		if(event instanceof Event) {
			conf.top = event.clientY;
			conf.left = event.clientX;
		}

		conf.show = true;
	};
}