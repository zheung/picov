<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Fas v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part v-if="I.urlHeader" header :style="{ backgroundImage: `url(${I.urlHeader})` }" />
			<p-part v-if="I.uid" :title="I.uid">作者（{{I.name ?? I.uid}}）</p-part>


			<p-part ref="nextPager" v-tip.bottom="'下一页'" panel right tabindex="7" @click="atFetch(1)" @keydown.enter.space="atFetch(1)">
				<Fas :icon="faAngleDoubleRight" />
			</p-part>

			<p-part v-tip.bottom="'当前页'" panel right input _page>
				<Fas :icon="faBookOpen" corner />
				<input v-model="I.pagePre" tabindex="6" type="text" @keydown.enter="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'上一页'" panel right tabindex="5" @click="atFetch(-1)" @keydown.enter.space="atFetch(-1)">
				<Fas :icon="faAngleDoubleLeft" />
			</p-part>

			<p-part v-tip.bottom="'全部下载'" panel right @click="IA.saveAll(I.illustsNow)"><Fas :icon="faDownload" /></p-part>

			<p-part v-tip.bottom="'作者主页'" panel right @click="atOpen"><Fas :icon="faHomeUser" /></p-part>

			<p-part v-tip.bottom="I.isFollowed ? '已关注' : '未关注'" panel right @click="atFollow"><Fas :icon="I.isFollowed ? faUserCheck : faUserPlus" /></p-part>

			<p-part v-if="I.illustsNow.length" right><Fas :icon="faPaintBrush" /> {{I.alls.length}}</p-part>
			<p-part v-if="I.illustsNow.length" right><Fas :icon="faSave" /> {{counter}}</p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" @scroll="atScroll" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, provide, ref } from 'vue';

	import { faAngleDoubleRight, faAngleDoubleLeft, faDownload, faSave, faPaintBrush, faBookOpen, faHomeUser, faUserCheck, faUserPlus } from '@fortawesome/free-solid-svg-icons';

	import { Tab } from '../../../lib/TabAdmin.js';

	import Illusts from './utility/Illusts.vue';
	import Topbar from './utility/Topbar.vue';

	import updatePage from './utility/updatePage.js';
	import { stateFetchIcon } from './utility/stateFetch.js';



	/** @type {import('vue').Ref<import('../../../lib/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');
	/** @type {import('vue').Ref<import('../admin/UserAdmin.js').default>} */
	const UA = inject('userAdmin');


	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const atOpen = () => window.open(`https://www.pixiv.net/users/${I.value.uid}/illustrations`);
	const atFollow = async () => {
		try {
			await UA.value.followUser(I.value.uid);

			now.value.info.isFollowed = true;
		}
		catch { void 0; }
	};


	const recoverScrollTop = ref(null);
	provide('recoverScrollTop', recoverScrollTop);
	const updateScrollTop = tab => recoverScrollTop.value = [tab];
	onActivated(() => updateScrollTop(now.value));

	const atScroll = top => now.value.scrollTop = top;


	const stateFetch = ref(0);

	const initUser = async () => {
		const tabNow = now.value;
		const info = tabNow.info;


		stateFetch.value = 1;
		try {
			const { illusts, mangas, alls, name, isFollowed, urlHeader } = await IA.value.fetchUser(info.uid, false);
			stateFetch.value = 2;


			info.illusts = illusts;
			info.mangas = mangas;
			info.alls = alls;

			info.name = name;
			info.isFollowed = isFollowed;
			info.urlHeader = urlHeader;

			tabNow.typeTab = 'header';
			tabNow.header = urlHeader;
			tabNow.title = `作者：${name}`;

			info.isInitUser = true;

			atFetch();
		}
		catch(error) {
			stateFetch.value = 3;

			throw error;
		}
	};



	const atFetch = async (step_ = 0) => {
		const tabNow = now.value;
		const info = tabNow.info;


		if(!info.isInitUser) { return initUser(); }


		stateFetch.value = 1;
		try {
			const { pagePre } = updatePage(info, step_);
			const iidsNow = info.alls.slice((pagePre - 1) * 15, pagePre * 15);
			info.illustsNow = await IA.value.fetchIllusts(iidsNow);
			stateFetch.value = 2;


			tabNow.title = `【作者】${info.name}（第${pagePre}页）`;
			info.page = pagePre;

			tabNow.scrollTop = 0;
			updateScrollTop(tabNow);
		}
		catch(error) {
			stateFetch.value = 3;

			throw error;
		}
	};


	onMounted(() => TA.value.emitChange());

	TA.value.addChanger('user', async tab_ => {
		const tab = tab_;


		now.value = tab;


		if(!tab.info.isInit) {
			tab.info.isInit = true;
			tab.info.isInitUser = false;

			const [uid] = tab.params;

			tab.info.uid = uid;
			tab.info.page = 0;
			tab.info.pagePre = 1;


			atFetch();
		}
	});

	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());
</script>

<style lang="sass" scoped>
</style>
