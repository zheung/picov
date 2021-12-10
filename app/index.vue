<template>
	<!-- 侧边栏 -->
	<p-sidebar>
		<p-button v-tip.right="'我的档案'" tabindex="1" profile>{{profile?.name?.[0] ?? ''}}</p-button>
		<p-button v-tip.right="'我的关注'" tabindex="2" @click="IS.type = 'follow'" @keydown.enter.space="IS.type = 'follow'"><Fas icon="home" /></p-button>
		<p-button v-tip.right="'下一页'" tabindex="3" @click="IS.next()" @keydown.enter.space="IS.next()"><Fas icon="angle-double-right" /></p-button>
		<p-button v-tip.right="'当前页'" expand>
			<Fas icon="book-open" />
			<input v-model="pageNew" tabindex="4" type="text" @keydown.enter="IS.jump(pageNew)" />
		</p-button>
		<p-button v-tip.right="'上一页'" tabindex="5" @click="IS.prev()" @keydown.enter.space="IS.prev()"><Fas icon="angle-double-left" /></p-button>
		<p-button v-tip.right="'搜索栏'" expand keyword>
			<Fas icon="search" />
			<input v-model="keyword" tabindex="6" type="text" @keydown.enter="IS.search(pageNew)" />
		</p-button>
	</p-sidebar>

	<!-- 主模块 -->
	<p-main>
		<keep-alive>
			<component :is="moduleNow" />
		</keep-alive>
	</p-main>
</template>

<script setup>
	import { ref, watch, onBeforeMount, inject, provide, } from 'vue';
	import Illusts from './picov/illust/Illusts.js';


	const app = inject('app');
	const CV = inject('CV');
	const $alert = inject('$alert');
	const $get = inject('$get');
	const wock = window.W = inject('$wock');

	const profile = ref({});
	provide('profile', profile);

	const IS = new Illusts(wock, profile);
	provide('IS', IS);

	const page = IS.page;

	const pageNew = ref(page.value);
	const keyword = ref('');


	document.title = 'Picov 5';


	// 设置全局CSS变量
	// theme变量由于postcss处理，依然在<style>中定义
	CV.setAll({
		widthSidebar: '3.5rem',

		widthScroll: '0.5rem',
		heightTopbar: '0rem',
	});


	const moduleNow = ref(null);
	const modulePre = ref('');

	const namesProfile = ref([]);

	onBeforeMount(async () => {
		namesProfile.value = await $get('picov/profile/list') ?? [];

		profile.value = await $get('picov/profile/info', { who: namesProfile.value[0] });

		wock.at('open', () => modulePre.value = 'picov-illust-List');
	});


	watch(modulePre, async slot => {
		if(app.component(slot)) { return moduleNow.value = slot; }

		try {
			const parts = String(slot).split('-');

			try {
				if(parts.length == 2) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}.vue`)).default); }
				else if(parts.length == 3) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}.vue`)).default); }
				else if(parts.length == 4) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}.vue`)).default); }
				else { throw TypeError(`模块深度不为[2,3,4]: ${slot}`); }
			}
			catch(error) {
				if(parts.length == 2) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/index.vue`)).default); }
				else if(parts.length == 3) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/index.vue`)).default); }
				else if(parts.length == 4) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}/index.vue`)).default); }
				else { throw TypeError(`模块深度不为[2,3,4]: ${slot}`); }
			}

			moduleNow.value = slot;
		}
		catch(error) { $alert(`加载模块失败: ${slot}, ${error.message || error}`, '加载模块失败'); }
	});
</script>

<style lang="sass" scoped>
p-sidebar
	@apply fixed z-20 shadow-mdd p-1 bg-gray-100
	width: var(--widthSidebar)
	height: calc(100% - var(--heightTopbar))
	top: var(--heightTopbar)
	background-color: var(--colorMain)


	p-button
		@apply relative block rounded-md text-center text-xl shadow-mdd mt-2 cursor-pointer outline-none
		width: calc( var(--widthSidebar) - 0.55rem)
		height: calc( var(--widthSidebar) - 0.55rem)
		line-height: calc( var(--widthSidebar) - 0.55rem)
		background-color: var(--colorTextMain)
		color: var(--colorText)

		&:focus
			@apply ring-4 ring-yellow-600

		&[profile]
			@apply font-bold mt-0

		&[expand]
			@apply overflow-hidden px-1

			&:focus-within
				@apply overflow-visible w-24 ring-4 ring-yellow-600

			input
				@apply rounded-md w-full text-center outline-none z-20

			svg
				@apply absolute opacity-25 z-10 text-xs top-0.5 left-0.5

		&[keyword]
			&:focus-within
				@apply w-48


p-main
	margin-top: var(--heightTopbar)
	margin-left: var(--widthSidebar)
	width: calc(100% - var(--widthSidebar))
	@apply block relative

	module
		@apply block relative
</style>


<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>


<style lang="sass">
html
	--colorMain: theme("colors.blue.500")
	--colorMainDark: theme("colors.blue.700")
	--colorMainLight: theme("colors.blue.400")
	--colorBackground: theme("colors.gray.100")
	--colorText: theme("colors.gray.900")
	--colorTextMain: theme("colors.gray.100")
	--colorDisable: theme("colors.gray.500")
	--colorOkay: theme("colors.green.500")
	--colorFail: theme("colors.red.500")
	--cAccentSelected: theme("colors.blue.200")
	--cAccentHover: theme("colors.green.200")
	--cLightD: theme("colors.gray.200")

html
	@apply h-full overflow-x-hidden overflow-y-auto
	color: var(--colorText)


// body
// 	@apply bg-gray-500 sm:bg-blue-400 md:bg-red-400 lg:bg-green-500 xl:bg-yellow-500

input
	color: var(--colorText)

/** Scrollbar Style **/
*
	scrollbar-width: thin
	scrollbar-color: rgba(119, 119, 119, 0.3) rgba(119, 119, 119, 0.1)

::-webkit-scrollbar
	width: var(--widthScroll)
	height: var(--widthScroll)

::-webkit-scrollbar-track:hover
	background-color: rgba(119, 119, 119, 0.1)

::-webkit-scrollbar-thumb
	border-radius: var(--widthScroll)
	background: rgba(119, 119, 119, 0.3)

::-webkit-scrollbar-thumb:hover
	background: rgba(119, 119, 119, 0.4)

::-webkit-scrollbar-thumb:active
	background: rgba(119, 119, 119, 1)

::-webkit-scrollbar-corner
	background-color: transparent


.transAll, .transAll *, .trans
	transition-property: all
	transition-duration: 0.4s

	-webkit-transform: translateZ(0)
	-moz-transform: translateZ(0)
	-ms-transform: translateZ(0)
	-o-transform: translateZ(0)
	transform: translateZ(0)

	&._d02
		transition-duration: 0.2s
	&._d07
		transition-duration: 0.7s
	&._d2
		transition-duration: 2s
</style>