import './lib/hack.js';

import { createApp } from 'vue';

import App from './index.vue';


const app = createApp(App);
app.provide('app', app);


window.addEventListener('load', async () => {
	(await import('./lib/plugin/Bus.js')).install(app);
	(await import('./lib/plugin/Brop.js')).install(app);
	(await import('./lib/plugin/Alert/Alert.js')).install(app);
	(await import('./lib/plugin/Aegis.js')).install(app);
	(await import('./lib/plugin/Fontawesome.js')).install(app);
	(await import('./lib/plugin/Tippy/Tippy.js')).install(app);
	(await import('./lib/plugin/CSSVar.js')).install(app);
	(await import('./lib/plugin/Wocker/Wocker.js')).install(app);
	(await import('./lib/plugin/RightMenu.js')).install(app);


	app.mount('#app');
});