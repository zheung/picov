<template>
	<div class="nosel App">
		<div class="inline Side">
			<img class="header" :src="'./uapi/picov/image/header'" />
			<Fa class="icon" icon="search" />
			<Fa class="icon" icon="home" />
			<Fa class="icon _split" icon="minus" />
			<Fa class="icon" icon="plus" />
		</div>
		<keep-alive>
			<component :is="B.viewNow.slot" class="inline View" />
		</keep-alive>
	</div>
</template>

<script>
	import B from 'Bus';

	import initFontawesome from './libs/fontawesome';
	import { A } from './libs/connect';
	import Wock from './libs/wock.web';

	document.title = 'Picov 2.X';

	window.L = (console || 0).log;
	window.B = B;
	window.A = A;

	initFontawesome(B);

	B.Vue.set(B, 'viewNow', { slot: '', view: null, name: null, time: 0 });
	B.Vue.set(B, 'lists', {});
	B.Vue.set(B, 'typeList', '');
	B.Vue.set(B, 'illusts', {});

	const vomps_name = {};
	const views_name = {};

	export default {
		data() {
			return {
				B,
			};
		},

		beforeCreate() {
		},

		beforeMounted() {

		},

		mounted() {
			window.app = this;

			this.$set(B, 'W', new Wock(`ws://${location.host}/wock`, { ping: false, logger: true }));

			this.changeView('list');
		},

		methods: {
			// 切换视图View
			async changeView(viewName, time = 1) {
				if(!viewName) { return; }

				const slot = `vomp-${viewName}-${time}`;

				// 如果是相同view, 则返回
				if(B.viewNow.slot == slot) { return; }

				// 保证View字典
				if(!views_name[viewName]) { views_name[viewName] = {}; }

				// 查找View
				let view = B.Vue.component(slot);

				// 没有则加载Vomp
				if(!view) {
					// 找查View, 没有则异步加载Vomp
					let vomp = vomps_name[viewName];

					if(!vomp) {
						vomp = vomps_name[viewName] = (await import(
							/* webpackInclude: /\.vue/ */
							/* webpackChunkName: 'vomps/[request]' */
							`../${viewName.replace(/-/g, '/')}`
						)).default;
					}

					view = B.Vue.component(slot, vomp);
				}

				// 保存view
				B.viewNow.slot = slot;
				B.viewNow.name = viewName;
				B.viewNow.time = time;

				// // 更新hash
				// window.location.hash = `#${viewName}`;
			},
			updateIllusts(illusts) {
				const illustsCache = B.illusts;
			}
		},
	};
</script>

<style lang="sass">
@import './public'
</style>

<style lang="sass" scoped>
$widthSide: 40px

.App
	position: relative
	width: 100%
	height: 100%
	overflow-x: hidden
	overflow-y: auto

.Side
	position: fixed
	width: $widthSide
	height: 100%
	background: var(--cStress)
	text-align: center

	>.header
		position: relative
		box-sizing: border-box
		margin: 2px
		margin-bottom: 14px
		width: calc(100% - 4px)
		border: 2px solid #2c3e50
		border-radius: 2px
		cursor: pointer

	>.icon
		position: relative
		box-sizing: border-box
		width: 24px
		height: 32px
		color: var(--cDark)
		cursor: pointer

		&._split
			border-top: 1px solid var(--cLight)

.View
	position: relative
	left: $widthSide
	width: calc(100% - #{$widthSide})
	background: var(--cDark)
</style>