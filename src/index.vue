<template>
	<!-- 侧边栏 -->
	<p-sidebar>
		<p-profiles ref="domProfiles">
			<template v-for="name of namesProfile" :key="`profiles-${name}`">
				<p-profile-name :now="brop(who == name)" @click="changeProfile(name)">
					<Icon corn :icon="who == name ? faUserCheck : faUser" />
					{{ name }}
				</p-profile-name>
			</template>
		</p-profiles>


		<p-button v-tip.right="'搜索栏'" expand keyword>
			<Icon corn :icon="faSearch" @click="atSearch(keyword)" @mousedown.middle.prevent.stop="atSearch(keyword, true)" />
			<input v-model="keyword" tabindex="2" type="text" @keydown.enter.exact="atSearch(keyword)" @keydown.enter.shift="atSearch(keyword, true)" />
		</p-button>


		<p-button ref="domButtonMenu">
			<Icon :icon="faStream" />
		</p-button>
		<p-menus ref="domMenus">
			<p-button v-tip.right="'【本地】新图库'" @click="atOpenLocalGallery">
				<Icon :icon="faHdd" />
			</p-button>
			<p-button v-tip.right="'【本地】幻灯片'" @click="atOpenLocalSlider">
				<Icon :icon="faImages" />
			</p-button>
			<p-button v-tip.right="'【本地】动画库'" @click="atOpenLocalUgoiraPrepare">
				<Icon :icon="faVideo" />
			</p-button>
			<p-button ref="domButtonBookmark">
				<Icon :icon="faBookmark" />
			</p-button>
			<p-button ref="domButtonProfile" tabindex="1" profile>{{ profile?.name?.[0] ?? '' }}</p-button>
		</p-menus>

		<p-bookmarks ref="domBookmarks">
			<template v-for="(bookmark, kind) of profile.bookmark" :key="`bookmark-kind-${kind}`">
				<p-bookmark-kind :now="brop(kindBookmarkNow == kind)" @click="kindBookmarkNow = kind">
					{{ kind }}
				</p-bookmark-kind>
			</template>
			<template v-for="bookmark of bookmarksNow" :key="`bookmark-${bookmark[0]}`">
				<p-bookmark :title="bookmark[1]" @click="atSearch(bookmark[1])">
					{{ bookmark[0] }}
				</p-bookmark>
			</template>
		</p-bookmarks>


		<template v-for="(tab, index) of TA.list" :key="`tab-${tab?.id}`">
			<template v-if="!tab.isHidden">
				<p-button v-tip.right="tab.title"
					v-menu="{ params: tab, ...menuTab, disabled: () => tab.typeList == 'follow' }"
					:now="brop(TA.now === tab)" :tabindex="100 + index" @click="TA.change(tab)"
					@keydown.enter.space="TA.change(tab)"
				>
					<template v-if="tab.typeTab == 'icon'">
						<Icon :icon="tab.icon" />
					</template>
					<template v-if="tab.typeTab == 'header'">
						<Icon corn :icon="tab.icon" />
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
	import { ref, onBeforeMount, provide, computed, onMounted, inject, watch } from 'vue';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faUser, faUserCheck, faSearch, faHome, faListOl, faUserEdit } from '@fortawesome/free-solid-svg-icons';
	import { faStream, faHdd, faImages, faVideo, faBookmark } from '@fortawesome/free-solid-svg-icons';

	import Clipboard from 'clipboard';
	import Tippy from 'tippy.js';

	import CV from '@nuogz/css-var';
	import { $wock } from '@nuogz/wock-client';
	import { $get, $post } from '@nuogz/aegis';

	import TabAdmin from './lib/TabAdmin.js';
	import IllustAdmin from './pixiv/illust/admin/IllustAdmin.js';
	import UserAdmin from './pixiv/illust/admin/UserAdmin.js';

	import './index.pcss';
	import './index.sass';



	document.title = 'Picov';


	CV.widthSidebar = '3.6rem';
	CV.widthScroll = '0.5rem';
	CV.heightTopbar = '0rem';


	const moduleNow = ref(null);
	const loadModule = inject('load-module')(moduleNow);

	const modulePre = ref('');
	watch(modulePre, loadModule);


	const profile = ref({});
	provide('profile', profile);
	const who = computed(() => profile.value.name);
	provide('who', who);

	const TA = ref(new TabAdmin(modulePre));
	provide('tabAdmin', TA);

	const IA = ref(new IllustAdmin($wock, profile, $get, $post).init());
	provide('illustAdmin', IA);

	const UA = ref(new UserAdmin($wock, profile, $post).init());
	provide('userAdmin', UA);


	const atOpenLocalGallery = () => TA.value.addIcon('【本地】新图库', faHdd, 'local-gallery|once', 'local-Gallery');
	const atOpenLocalUgoiraPrepare = () => TA.value.addIcon('【本地】动画库', faVideo, 'local-ugoira|once', 'local-Ugoira');
	const atOpenLocalSlider = () => TA.value.addIcon('【本地】幻灯片', faImages, 'local-slider|once', 'local-Slider');

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


	const cookies = document.cookie.split(';')
		.map(raw => raw.split('='))
		.reduce((cookies, [key, value]) => void (cookies[key] = value) || cookies, {});

	const updateProfile = async who => profile.value = await $get('picov/profile/info', { who });
	const changeProfile = async name => location.reload(void await updateProfile(cookies.who = name));

	const namesProfile = ref([]);
	const atWockOpen = async () => {
		let who = cookies.who;

		namesProfile.value = await $get('picov/profile/list') ?? [];
		if(!who) { who = namesProfile.value[0]; }

		await updateProfile(who);


		TA.value.addIcon('我的关注', faHome, 'follow', 'pixiv-illust-list-Follow');
	};

	onBeforeMount(async () => $wock.add('$open', atWockOpen, true));


	const keyword = ref('');
	const atSearch = (keywordNew = '', author = false) => {
		keywordNew = keywordNew.trim();

		const matchIID = keywordNew.match(/pixiv\.net\/artworks\/([1-9]\d*)|^i([1-9]\d*)$|^pixiv #([1-9]\d*)$|^([1-9]\d*)_p\d+$/i);
		const matchUID = keywordNew.match(/pixiv\.net\/users\/([1-9]\d*)|^u([1-9]\d*)$/i);
		const iid = matchIID?.[1] ?? matchIID?.[2] ?? matchIID?.[3] ?? matchIID?.[4];
		const uid = matchUID?.[1] ?? matchUID?.[2];

		if(iid) {
			TA.value.addIcon('【搜索ID】', faListOl, 'number|once', 'pixiv-illust-list-Number', iid);
		}
		else if(uid) {
			TA.value.addIcon(`【作者】${uid}`, faUserEdit, 'user', 'pixiv-illust-list-User', uid);
		}
		else if(/^[1-9]\d*$/.test(keywordNew)) {
			if(author) {
				TA.value.addIcon(`【作者】${keywordNew}`, faUserEdit, 'user', 'pixiv-illust-list-User', keywordNew);
			}
			else {
				TA.value.addIcon('【搜索ID】', faListOl, 'number|once', 'pixiv-illust-list-Number', keywordNew);
			}
		}
		else {
			TA.value.addIcon(`【搜索】${keywordNew}`, faSearch, 'search', 'pixiv-illust-list-Search', keywordNew);
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
		appendTo: 'parent',
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
		appendTo: 'parent',
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
		appendTo: 'parent',
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
	background-color: var(--cMain)


	svg[corn]
			@apply absolute opacity-25 z-10 text-xs top-1 left-1


	p-button
		@apply relative block rounded-md text-center text-xl shadow-mdd mt-2 cursor-pointer outline-none
		width: calc( var(--widthSidebar) - 0.55rem)
		height: calc( var(--widthSidebar) - 0.55rem)
		line-height: calc( var(--widthSidebar) - 0.55rem)
		background-color: var(--cTextMain)
		color: var(--cTextBack)

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
			background-color: var(--cTextMain)
			color: var(--cTextBack)

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
		@apply block pt-0 pb-1 shadow-mdd bg-white rounded-md w-[20rem] overflow-hidden
		background-color: var(--cTextMain)
		color: var(--cTextBack)

		p-bookmark-kind
			@apply inblock p-2 w-16 whitespace-nowrap select-none text-center cursor-pointer

			&:hover
				background-color: var(--cTextMainDisabled)

			&[now]
				@apply font-bold

		p-bookmark
			@apply inblock text-sm m-1 p-1 px-2 whitespace-nowrap select-none cursor-pointer border border-gray-400 rounded-lg

			&:hover
				background-color: var(--cTextMainDisabled)



p-main
	margin-top: var(--heightTopbar)
	margin-left: var(--widthSidebar)
	width: calc(100% - var(--widthSidebar))
	@apply block relative

	module
		@apply block relative
</style>
