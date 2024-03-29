<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Icon v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part>搜索</p-part>

			<p-part v-tip.bottom="'关键词'" panel input _keyword>
				<Icon :icon="faSearch" corner />
				<input v-model="I.keywordPre" tabindex="4" type="text" @keydown.enter="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'模式'" panel input _mode>
				<Icon :icon="faCaretDown" corner />
				<Combo v-model="I.modePre" :options="optionsMode" align="center" drop-align="left" @update:model-value="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'匹配模式'" panel input _mode-search>
				<Icon :icon="faCaretDown" corner />
				<Combo v-model="I.modeSearchPre" :options="optionsModeSearch" align="center" drop-align="left" @update:model-value="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'作品类型'" panel input _mode>
				<Icon :icon="faCaretDown" corner />
				<Combo v-model="I.typePre" :options="optionsType" align="center" drop-align="left" @update:model-value="atFetch()" />
			</p-part>


			<p-part ref="nextPager" v-tip.bottom="'下一页'" panel right tabindex="7" @click="atFetch(1)" @keydown.enter.space="atFetch(1)">
				<Icon :icon="faAngleDoubleRight" />
			</p-part>

			<p-part v-tip.bottom="'当前页'" panel right input _page>
				<Icon :icon="faBookOpen" corner />
				<input v-model="I.pagePre" tabindex="6" type="text" @keydown.enter="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'上一页'" panel right tabindex="5" @click="atFetch(-1)" @keydown.enter.space="atFetch(-1)">
				<Icon :icon="faAngleDoubleLeft" />
			</p-part>

			<p-part v-tip.bottom="'全部下载'" panel right @click="IA.saveAll(I.illustsNow)">
				<Icon :icon="faDownload" />
			</p-part>

			<p-part v-if="I.illustsNow.length" right><Icon :icon="faPaintBrush" /> {{ I.total }}</p-part>
			<p-part v-if="I.illustsNow.length" right><Icon :icon="faSave" /> {{ counter }}</p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" @scroll="atScroll" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, provide, ref } from 'vue';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faAngleDoubleRight, faAngleDoubleLeft, faDownload, faSave, faPaintBrush, faBookOpen } from '@fortawesome/free-solid-svg-icons';


	import { Combo } from '@nuogz/vue-components';


	import { Tab } from '../../../lib/TabAdmin.js';

	import Illusts from './utility/Illusts.vue';
	import Topbar from './utility/Topbar.vue';

	import updatePage from './utility/updatePage.js';
	import { stateFetchIcon } from './utility/stateFetch.js';


	/** @type {import('vue').Ref<import('../../../lib/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const recoverScrollTop = ref(null);
	provide('recoverScrollTop', recoverScrollTop);
	const updateScrollTop = tab => recoverScrollTop.value = [tab];
	onActivated(() => updateScrollTop(now.value));

	const atScroll = top => now.value.scrollTop = top;


	const stateFetch = ref(0);
	const atFetch = async (step_ = 0) => {
		const tabNow = now.value;
		const info = tabNow.info;

		const stateFetch_ = stateFetch;
		if(stateFetch_.value == 1) { return; }


		stateFetch_.value = 1;
		try {
			const { keywordPre, pagePre, modePre, modeSearchPre, typePre } = updatePage(info, step_);

			let total;
			({ illusts: info.illustsNow, total } = await IA.value.fetchSearch(keywordPre, pagePre, modePre, modeSearchPre, typePre));
			stateFetch_.value = 2;


			tabNow.title = `【搜索】${keywordPre}（第${pagePre}页）`;

			info.keyword = keywordPre;
			info.page = pagePre;
			info.mode = modePre;
			info.modeSearch = modeSearchPre;
			info.type = typePre;

			info.total = total;

			tabNow.scrollTop = 0;
			updateScrollTop(tabNow);
		}
		catch(error) {
			stateFetch_.value = 3;

			throw error;
		}
	};


	onMounted(() => TA.value.emitChange());

	TA.value.addChanger('search', tab => {
		now.value = tab;


		if(!tab.info.isInit) {
			tab.info.isInit = true;

			const [keyword] = tab.params;

			tab.info.keyword = '';
			tab.info.page = 0;
			tab.info.mode = 'all';
			tab.info.modeSearch = 's_tag_tc';
			tab.info.type = 'artworks|all';

			tab.info.keywordPre = keyword;
			tab.info.pagePre = 1;
			tab.info.modePre = 'all';
			tab.info.modeSearchPre = 's_tag_tc';
			tab.info.typePre = 'artworks|all';


			atFetch();
		}
	});


	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());


	const optionsMode = [
		{ text: '全部', value: 'all' },
		{ text: '安全', value: 'safe' },
		{ text: '成人', value: 'r18' },
	];

	const optionsModeSearch = [
		{ text: '标签 (部分一致)', value: 's_tag' },
		{ text: '标签 (完全一致)', value: 's_tag_full' },
		{ text: '标签/标题/简介', value: 's_tag_tc' },
		{ text: '标题/简介', value: 's_tc' },
	];


	const optionsType = [
		{ text: '全部', value: 'artworks|all' },
		{ text: '作品', value: 'illustrations|illust_and_ugoira' },
		{ text: '插画', value: 'illustrations|illust' },
		{ text: '动图', value: 'illustrations|ugoira' },
		{ text: '漫画', value: 'manga|manga' },
	];
</script>

<style lang="sass" scoped>
[_mode]
	@apply w-24

[_mode-search]
	@apply w-48
</style>
