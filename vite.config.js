import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import pluginVue from '@vitejs/plugin-vue';



const dirPackage = dirname(fileURLToPath(import.meta.url));
const PKG = JSON.parse(readFileSync(resolve(dirPackage, 'package.json'), 'utf-8'));

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			pluginVue({
				template: {
					compilerOptions: {
						isCustomElement: tag => /^((module-|comp-|p-).+?|module)$/.test(tag)
					}
				}
			})
		],
		define: { PACKAGE_VERSION: JSON.stringify(PKG.version) },
		root: resolve(dirPackage, 'src'),
		base: './',
		build: {
			target: 'esnext',
			outDir: resolve(dirPackage, 'dist'),
			emptyOutDir: true,
			chunkSizeWarningLimit: 1024,
			minify: false
		},
		publicDir: resolve(dirPackage, 'src', 'public'),
		clearScreen: false,
		server: {
			hmr: { port: 4500 },
			port: 4700,
			proxy: {
				'^/ugoira/(prepare|archive)/': {
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
			},
			watch: {
				ignored: [
					'!**/@nuogz/**',
					'**/*.{api,lib,map}.js',
					'**/*.lib/**/*.js'
				]
			}
		}
	};
});
