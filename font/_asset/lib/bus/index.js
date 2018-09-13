import initAlert from './alert';
import initMenu from './menu';
import initTridata from './tridata';
import initWindow from './wins';

import initPlat from './_plat';

export default function() {
	let bus = { data: {} };
	let x = {};

	window.BUS = bus;
	window.X = x;

	initAlert(bus, x);
	initMenu(bus, x);
	initTridata(bus, x);
	initWindow(bus, x);

	initPlat(bus, x);
}