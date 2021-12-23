<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> </p-part>
			<p-part :title="I.params.uid">搜索</p-part>

			<p-part v-tip.bottom="'关键词'" panel input _keyword>
				<Fas icon="search" corner />
				<input v-model="I.paramsPre.keyword" tabindex="4" type="text" @keydown.enter="atFetch" />
			</p-part>

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

			<p-part v-tip.bottom="'全部下载'" panel right @click="IA.saveAll(I.illustsNow)">
				<Fas icon="download" />
			</p-part>

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


	const atFetch = async step_ => {
		const tabNow = now.value;
		const info = tabNow.info;


		const { keyword, page } = updatePage(info.paramsPre, step_);
		info.illustsNow = await IA.value.fetchSearch(page);


		tabNow.title = `【搜索】${keyword}（第${page}页）`;
		info.params.keyword = keyword;
		info.params.page = page;
	};


	const atChangeTab = () => {
		const tab = TA.value.now;
		const params = TA.value.params;

		if(tab.typeList != 'search') { return; }


		now.value = tab;
		const [keyword, sInitTab] = params;

		if(sInitTab === TA.value.sInitTab) {
			tab.info.params = { keyword, page: 1 };
			tab.info.paramsPre = { keyword, page: 1 };

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