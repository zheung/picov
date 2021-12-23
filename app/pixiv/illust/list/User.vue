<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> 加载作者（{{I.params.uid}}）</p-part>
			<p-part v-if="I.illustsNow.length" header :style="{ backgroundImage: `url(${now.header})` }" />
			<p-part v-if="I.illustsNow.length" :title="I.params.uid">作者（{{I.name}}</p-part>


			<p-part ref="nextPager" v-tip.bottom="'下一页'" panel right tabindex="7" @click="atFetch(1)" @keydown.enter.space="atFetch(1)">
				<Fas icon="angle-double-right" />
			</p-part>
			<p-part v-tip.bottom="'当前页'" panel right input _page>
				<Fas icon="book-open" corner />
				<input v-model="I.paramsPre.page" tabindex="6" type="text" @keydown.enter="atFetch" />
			</p-part>
			<p-part v-tip.bottom="'上一页'" panel right tabindex="5" @click="atFetch(-1)" @keydown.enter.space="atFetch(-1)">
				<Fas icon="angle-double-left" />
			</p-part>
			<p-part v-tip.bottom="'全部下载'" panel right @click="IA.saveAll(I.illustsNow)"><Fas icon="download" /></p-part>
			<p-part v-tip.bottom="'作者主页'" panel right @click="atOpen"><Fas icon="house-user" /></p-part>
			<p-part v-tip.bottom="I.isFollowed ? '已关注' : '未关注'" panel right @click="atOpen"><Fas :icon="I.isFollowed ? 'user-check' : 'user-plus'" /></p-part>
			<p-part v-if="I.illustsNow.length" right><Fas icon="save" /> {{counter}}</p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onBeforeMount, ref, watch } from 'vue';

	import { Tab } from '../admin/TabAdmin.js';

	import Illusts from './utility/Illusts.vue';
	import Topbar from './utility/Topbar.vue';

	import updatePage from './utility/updatePage.js';


	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');
	/** @type {import('vue').Ref<import('../admin/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const atOpen = () => window.open(`https://www.pixiv.net/users/${I.value.params.uid}/illustrations`);


	const atFetch = async step_ => {
		const tabNow = now.value;
		const info = tabNow.info;


		const { page } = updatePage(info.paramsPre, step_);
		const iidsNow = info.alls.slice((page - 1) * 15, page * 15);
		info.illustsNow = await IA.value.fetchIllusts(iidsNow);


		tabNow.title = `【作者】${info.name}（第${page}页）`;
		info.params.page = page;
	};


	const atChangeTab = async () => {
		const tab = TA.value.now;
		const params = TA.value.params;

		if(tab.typeList != 'user') { return; }
		now.value = tab;

		const [uid, sInitTab] = params;

		if(sInitTab === TA.value.sInitTab) {
			tab.info.params = { uid, page: 1 };
			tab.info.paramsPre = { uid, page: 1 };


			const { illusts, mangas, alls, name, isFollowed, urlHeader } = await IA.value.fetchUser(uid, false);

			tab.info.illusts = illusts;
			tab.info.mangas = mangas;
			tab.info.alls = alls;

			tab.info.name = name;
			tab.info.isFollowed = isFollowed;
			tab.info.urlHeader = urlHeader;

			tab.typeTab = 'header';
			tab.header = urlHeader;
			tab.title = `作者：${name}`;

			atFetch();
		}
	};

	watch(() => TA.value.now, atChangeTab);
	onBeforeMount(atChangeTab);

	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());
</script>

<style lang="sass" scoped>
</style>