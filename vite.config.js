import { resolve } from 'path';

import { defineConfig } from 'vite';
import pluginVue from '@vitejs/plugin-vue';

import { dirProject } from './lib/global.dir.js';


export default defineConfig({
	plugins: [
		pluginVue({
			template: {
				compilerOptions: {
					isCustomElement: tag => /^((module-|comp-|p-).+?|module)$/.test(tag)
				}
			}
		}),
	],
	root: resolve(dirProject, 'app'),
	base: './',
	build: {
		outDir: resolve(dirProject, 'dist'),
		emptyOutDir: true,
		chunkSizeWarningLimit: 1024
	},
	publicDir: resolve(dirProject, 'app', 'public'),
	clearScreen: false,
	server: {
		port: 4791,
		proxy: {
			'^/ugoira-(new|saved)/': {
				target: 'http://127.0.0.1:14791',
			},
			'^/api/': {
				target: 'http://127.0.0.1:14791',
				changeOrigin: true,
			},
			'/wock': {
				target: 'ws://127.0.0.1:14791/wock',
				ws: true
			},
		}
	}
});
