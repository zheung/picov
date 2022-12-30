<template>
	<!-- 侧边栏 -->
	<p-sidebar>
		<p-profiles ref="domProfiles">
			<template v-for="name of namesProfile" :key="`profiles-${name}`">
				<p-profile-name :now="brop(who == name)" @click="changeProfile(name)">
					<Fas corn :icon="who == name ? 'user-check' : 'user'" />
					{{name}}
				</p-profile-name>
			</template>
		</p-profiles>


		<p-button v-tip.right="'搜索栏'" expand keyword>
			<Fas corn icon="search" @click="atSearch(keyword)" />
			<input v-model="keyword" tabindex="2" type="text" @keydown.enter.exact="atSearch(keyword)" @keydown.enter.shift="atSearch(keyword, true)" />
		</p-button>


		<p-button ref="domButtonMenu">
			<Fas icon="stream" />
		</p-button>
		<p-menus ref="domMenus">
			<p-button v-tip.right="'【本地】新图库'" @click="atOpenLocalGallery">
				<Fas icon="hdd" />
			</p-button>
			<p-button v-tip.right="'【本地】幻灯片'" @click="atOpenLocalSlider">
				<Fas icon="images" />
			</p-button>
			<p-button v-tip.right="'【本地】新动画'" @click="atOpenLocalUgoiraNew">
				<Fas icon="video" />
			</p-button>
			<p-button ref="domButtonBookmark">
				<Fas icon="bookmark" />
			</p-button>
			<p-button ref="domButtonProfile" tabindex="1" profile>{{profile?.name?.[0] ?? ''}}</p-button>
		</p-menus>

		<p-bookmarks ref="domBookmarks">
			<template v-for="(bookmark, kind) of profile.bookmark" :key="`bookmark-kind-${kind}`">
				<p-bookmark-kind
					:now="brop(kindBookmarkNow == kind)"
					@click="kindBookmarkNow = kind"
				>
					{{kind}}
				</p-bookmark-kind>
			</template>
			<template v-for="bookmark of bookmarksNow" :key="`bookmark-${bookmark[0]}`">
				<p-bookmark :title="bookmark[1]" @click="atSearch(bookmark[1])">
					{{bookmark[0]}}
				</p-bookmark>
			</template>
		</p-bookmarks>


		<template v-for="(tab, index) of TA.list" :key="`tab-${tab?.id}`">
			<template v-if="!tab.isHidden">
				<p-button
					v-tip.right="tab.title"
					v-menu="{ params: tab, ...menuTab, disabled: ()=>tab.typeList == 'follow' }"
					:now="brop(TA.now === tab)"
					:tabindex="100 + index"
					@click="TA.change(tab)" @keydown.enter.space="TA.change(tab)"
				>
					<template v-if="tab.typeTab == 'icon'">
						<Fas :icon="tab.icon" />
					</template>
					<template v-if="tab.typeTab == 'header'">
						<Fas corn :icon="tab.icon" />
						<p-header :style="{ backgroundImage: `url(${tab.header})` }" />
					</template>
				</p-button>
			</template>
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
	import { ref, watch, onBeforeMount, inject, provide, computed, onMounted } from 'vue';

	import Clipboard from 'clipboard';
	import Tippy from 'tippy.js';

	import IllustAdmin from './pixiv/illust/admin/IllustAdmin.js';
	import TabAdmin from './lib/TabAdmin.js';
	import UserAdmin from './pixiv/illust/admin/UserAdmin.js';


	document.title = 'Picov';


	const app = inject('app');
	const CV = inject('CV');
	const $alert = inject('$alert');
	const $get = inject('$get');
	const $post = inject('$post');
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
	const who = computed(() => profile.value.name);
	provide('who', who);

	const TA = ref(new TabAdmin(modulePre));
	provide('tabAdmin', TA);

	const IA = ref(new IllustAdmin(wock, profile, $get, $post).init());
	provide('illustAdmin', IA);

	const UA = ref(new UserAdmin(wock, profile, $post).init());
	provide('userAdmin', UA);


	const atOpenLocalGallery = () => TA.value.addIcon('【本地】新图库', 'hdd', 'local-gallery|once', 'local-Gallery');
	const atOpenLocalUgoiraNew = () => TA.value.addIcon('【本地】新动画', 'video', 'local-ugoira|once', 'local-Ugoira');
	const atOpenLocalSlider = () => TA.value.addIcon('【本地】幻灯片', 'images', 'local-slider|once', 'local-Slider');

	const menuTab = {
		useLongPressInMobile: true,
		menuWrapperCss: { background: 'snow', borderRadius: '4px' },
		menuItemCss: { hoverBackground: '#bfdbfe' },
		menuList: [
			{
				label: '🚪 关闭',
				tips: '关闭该标签页',
				hidden: tab => tab.typeList == 'follow',
				fn: tab => TA.value.del(tab),
			},
			{ line: true, hidden: tab => !['number', 'user'].includes(tab.typeList) },
			{
				label: '📝 复制ID',
				hidden: tab => tab.typeList != 'number',
				fn: tab => Clipboard.copy(String(tab.info.iid)),
			},
			{
				label: '📝 复制作者ID',
				hidden: tab => tab.typeList != 'user',
				fn: tab => Clipboard.copy(String(tab.info.uid)),
			},
		]
	};


	CV.setAll({
		widthSidebar: '3.5rem',

		widthScroll: '0.5rem',
		heightTopbar: '0rem',
	});


	const cookies = document.cookie.split(';')
		.map(raw => raw.split('='))
		.reduce((cookies, [key, value]) => void (cookies[key] = value) || cookies, {});

	const updateProfile = async who => profile.value = await $get('picov/profile/info', { who });
	const changeProfile = async name => location.reload(void await updateProfile(cookies.who = name));

	const namesProfile = ref([]);
	const atReady = async () => {
		let who = cookies.who;


		namesProfile.value = await $get('picov/profile/list') ?? [];
		if(!who) { who = namesProfile.value[0]; }

		await updateProfile(who);


		TA.value.addIcon('我的关注', 'home', 'follow', 'pixiv-illust-list-Follow');
	};

	onBeforeMount(async () => wock.at('open', atReady, true));


	const keyword = ref('');
	const atSearch = (keywordNew = '', author = false) => {
		const matchIID = keywordNew.trim().match(/pixiv\.net\/artworks\/([1-9]\d*)|^i([1-9]\d*)$/i);
		const matchUID = keywordNew.trim().match(/pixiv\.net\/users\/([1-9]\d*)|^u([1-9]\d*)$/i);
		const iid = matchIID?.[1] ?? matchIID?.[2];
		const uid = matchUID?.[1] ?? matchUID?.[2];

		if(iid) {
			TA.value.addIcon('【搜索ID】', 'list-ol', 'number|once', 'pixiv-illust-list-Number', iid);
		}
		else if(uid) {
			TA.value.addIcon(`【作者】${uid}`, 'user-edit', 'user', 'pixiv-illust-list-User', uid);
		}
		else if(/^[1-9]\d*$/.test(keywordNew.trim())) {
			if(author) {
				TA.value.addIcon(`【作者】${keywordNew}`, 'user-edit', 'user', 'pixiv-illust-list-User', keywordNew);
			}
			else {
				TA.value.addIcon('【搜索ID】', 'list-ol', 'number|once', 'pixiv-illust-list-Number', keywordNew);
			}
		}
		else {
			TA.value.addIcon(`【搜索】${keywordNew}`, 'search', 'search', 'pixiv-illust-list-Search', keywordNew);
		}


		keyword.value = '';
	};


	const domButtonProfile = ref(null);
	const domProfiles = ref(null);

	onMounted(() => Tippy(domButtonProfile.value, {
		placement: 'right-start',
		content: domProfiles.value,
		allowHTML: true,
		interactive: true,
		animation: '',
		duration: [0, 0],
	}));


	const domButtonMenu = ref(null);
	const domMenus = ref(null);

	onMounted(() => Tippy(domButtonMenu.value, {
		placement: 'right-start',
		content: domMenus.value,
		allowHTML: true,
		interactive: true,
		animation: '',
		duration: [0, 0],
	}));


	const domButtonBookmark = ref(null);
	const domBookmarks = ref(null);

	onMounted(() => Tippy(domButtonBookmark.value, {
		placement: 'right-start',
		content: domBookmarks.value,
		allowHTML: true,
		interactive: true,
		animation: '',
		duration: [0, 0],
		offset: [1, 8],
	}));

	const kindBookmarkNow = ref('常用');
	const bookmarksNow = computed(() => profile.value.bookmark?.[kindBookmarkNow.value] ?? []);
</script>

<style lang="sass" scoped>
p-sidebar
	@apply fixed z-50 shadow-mdd p-1 bg-gray-100
	width: var(--widthSidebar)
	height: calc(100% - var(--heightTopbar))
	top: var(--heightTopbar)
	background-color: var(--colorMain)


	svg[corn]
			@apply absolute opacity-25 z-10 text-xs top-1 left-1


	p-button
		@apply relative block rounded-md text-center text-xl shadow-mdd mt-2 cursor-pointer outline-none
		width: calc( var(--widthSidebar) - 0.55rem)
		height: calc( var(--widthSidebar) - 0.55rem)
		line-height: calc( var(--widthSidebar) - 0.55rem)
		background-color: var(--colorTextMain)
		color: var(--colorText)

		&:focus
			@apply ring-2 ring-yellow-500

		&[profile]
			@apply font-bold mt-0

		&[expand]
			@apply overflow-hidden px-1

			&:focus-within
				@apply overflow-visible w-24 ring-2 ring-yellow-500

			input
				@apply rounded-md w-full text-center outline-none z-20 bg-transparent

		&[keyword]:focus-within
			@apply w-48

		&[now]
			@apply ring-2 ring-pink-400

		p-header
			@apply relative block rounded-md shadow-md absolute top-1 left-1 bg-cover
			width: calc(100% - 0.5rem)
			height: calc(100% - 0.5rem)


	p-profiles
		@apply block p-0.5 pt-0

		p-profile-name
			@apply relative block rounded-md mt-2 text-center text-xl shadow-mdd cursor-pointer outline-none w-40 elli
			height: calc( var(--widthSidebar) - 0.55rem)
			line-height: calc( var(--widthSidebar) - 0.55rem)
			background-color: var(--colorTextMain)
			color: var(--colorText)

			&:hover
				@apply ring-2 ring-green-500

			&[now]
				@apply font-bold

	p-menus
		@apply block p-0.5 pt-0

		p-button
			@apply mt-0 mb-2

			&:hover
				@apply ring-2 ring-blue-500

	p-bookmarks
		@apply block pt-0 pb-1 shadow-mdd bg-white rounded-md w-80 overflow-hidden
		background-color: var(--colorTextMain)
		color: var(--colorText)

		p-bookmark-kind
			@apply inblock p-2 w-16 whitespace-nowrap select-none text-center cursor-pointer

			&:hover
				background-color: var(--cAccentSelected)

			&[now]
				@apply font-bold

		p-bookmark
			@apply inblock text-sm m-1 p-1 px-2 whitespace-nowrap select-none cursor-pointer border border-gray-400 rounded-lg

			&:hover
				background-color: var(--cAccentSelected)



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
