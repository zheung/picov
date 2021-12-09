import Wock from './Wock.js';


export const install = function(app) {
	const wock = new Wock(
		new URL('wock', location.origin).toString().replace(/^http/, 'ws'),
		(console || {}).log,
		(console || {}).error,
	);

	wock.reopen = true;
	wock.open('初始化');

	app.config.globalProperties.$wock = wock;
	app.provide('Wock', wock);
};