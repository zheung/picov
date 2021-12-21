<template>
	<!-- 侧边栏 -->
	<p-sidebar>
		<p-button v-tip.right="'我的档案'" tabindex="1" profile>{{profile?.name?.[0] ?? ''}}</p-button>
		<p-button v-tip.right="'搜索栏'" expand keyword>
			<Fas icon="search" />
			<input v-model="keyword" tabindex="2" type="text" @keydown.enter.exact="atSearch(keyword)" @keydown.enter.shift="atSearch(keyword, true)" />
		</p-button>


		<template v-for="(tab, index) of tabs" :key="`tab-${tab?.id}`">
			<p-button
				v-tip.right="tab.title"
				v-menu=" { params: tab, ...menuTab }"
				:now="brop(tabNow === tab)"
				:tabindex="100 + index"
				@click="TA.change(tab)" @keydown.enter.space="TA.change(tab)"
			>
				<template v-if="tab.typeTab == 'icon'">
					<Fas :icon="tab.icon" />
				</template>
				<template v-if="tab.typeTab == 'header'">
					<Fas header :icon="tab.icon" />
					<p-header :style="{ backgroundImage: `url(${tab.header})` }" />
				</template>
			</p-button>
		</template>
	</p-sidebar>

	<!-- 主模块 -->
	<p-main>
		<keep-alive>
			<component :is="moduleNow" :key="`module-${moduleNow}`" />
		</keep-alive>
	</p-main>
</template>

<script setup>
	import { ref, watch, onBeforeMount, inject, provide, computed, } from 'vue';

	import IllustAdmin from './pixiv/illust/admin/IllustAdmin.js';
	import TabAdmin from './pixiv/illust/admin/TabAdmin.js';


	document.title = 'Picov 5';


	const app = inject('app');
	const CV = inject('CV');
	const $alert = inject('$alert');
	const $get = inject('$get');
	const wock = window.W = inject('$wock');


	const moduleNow = ref(null);
	const modulePre = ref('');
	watch(modulePre, async slot => {
		if(app.component(slot)) { return moduleNow.value = slot; }

		try {
			const parts = String(slot).split('-');

			try {
				if(parts.length == 2) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}.vue`)).default); }
				else if(parts.length == 3) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}.vue`)).default); }
				else if(parts.length == 4) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}.vue`)).default); }
				else if(parts.length == 5) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}.vue`)).default); }
				else { throw TypeError(`模块深度不为[2,3,4,5]: ${slot}`); }
			}
			catch(error) {
				if(parts.length == 2) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/index.vue`)).default); }
				else if(parts.length == 3) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/index.vue`)).default); }
				else if(parts.length == 4) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}/index.vue`)).default); }
				else if(parts.length == 5) { app.component(slot, (await import(`./${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}/index.vue`)).default); }
				else { throw TypeError(`模块深度不为[2,3,4,5]: ${slot}`); }
			}

			moduleNow.value = slot;
		}
		catch(error) { $alert(`加载模块失败: ${slot}, ${error.message || error}`, '加载模块失败'); }
	});


	const profile = ref({});
	provide('profile', profile);
	provide('who', computed(() => profile.value.name));


	const IA = ref(new IllustAdmin(wock, profile));
	provide('IA', IA);

	const TA = new TabAdmin(modulePre, wock, profile);
	provide('TA', TA);

	const tabs = TA.list;
	const tabNow = TA.now;


	const menuTab = {
		useLongPressInMobile: true,
		menuWrapperCss: {
			background: 'snow',
			borderRadius: '4px'
		},
		menuItemCss: {
			hoverBackground: '#bfdbfe',
		},
		menuList: [
			{
				label: '关闭',
				tips: '关闭该标签页',
				disabled: tab => tab.typeList == 'follow',
				fn: tab => TA.del(tab)
			},
		]
	};


	CV.setAll({
		widthSidebar: '3.5rem',

		widthScroll: '0.5rem',
		heightTopbar: '0rem',
	});


	const namesProfile = ref([]);
	const atReady = async () => {
		namesProfile.value = await $get('picov/profile/list') ?? [];
		profile.value = await $get('picov/profile/info', { who: namesProfile.value[0] });

		TA.addIcon('我的关注', 'home', 'follow', 'pixiv-illust-list-Follow');
	};

	onBeforeMount(async () => wock.at('open', atReady, true));


	const keyword = ref('');
	const atSearch = (keywordNew, author = false) => {
		if(/^[1-9]\d*$/.test(keywordNew.trim())) {
			if(author) {
				TA.addIcon(`【作者】${keywordNew}`, 'user-edit', 'user', 'pixiv-illust-list-User', keywordNew.replace(/i/i, ''));
			}
			else {
				TA.addIcon(`【数字】${keywordNew}`, 'paint-brush', 'number', 'pixiv-illust-list-Number', keywordNew);
			}
		}
		else if(/^u[1-9]\d*$/i.test(keywordNew.trim())) {
			TA.addIcon(`【作者】${keywordNew}`, 'user-edit', 'user', 'pixiv-illust-list-User', keywordNew.replace(/u/i, ''));
		}
		else if(/^i[1-9]\d*$/i.test(keywordNew.trim())) {
			TA.addIcon(`【数字】${keywordNew}`, 'paint-brush', 'number', 'pixiv-illust-list-Number', keywordNew.replace(/i/i, ''));
		}
		else {
			TA.addIcon(`【搜索】${keywordNew}`, 'search', 'search', 'pixiv-illust-list-Search', keywordNew);
		}


		keyword.value = '';
	};
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
				@apply overflow-visible w-24 ring-2 ring-yellow-600

			input
				@apply rounded-md w-full text-center outline-none z-20 bg-transparent

			svg
				@apply absolute opacity-25 z-10 text-xs top-0.5 left-0.5

		&[keyword]:focus-within
			@apply w-48

		&[now]
			@apply ring-2 ring-pink-400

		p-header
			@apply relative block rounded-md shadow-md absolute top-1 left-1 bg-cover
			width: calc( 100% - 0.5rem)
			height: calc( 100% - 0.5rem)

		svg[header]
			@apply absolute opacity-25 z-10 text-xs top-0.5 left-0.5


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