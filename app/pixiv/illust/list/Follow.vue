<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part v-if="isFetching"><Fas icon="compass" :spin="true" /> </p-part>
			<p-part :title="I.params.uid">我的关注</p-part>


			<p-part ref="nextPager" v-tip.bottom="'下一页'" panel right tabindex="6" @click="atFetch(1)" @keydown.enter.space="atFetch(1)">
				<Fas icon="angle-double-right" />
			</p-part>

			<p-part v-tip.bottom="'当前页'" panel right input _page>
				<Fas icon="book-open" corner />
				<input v-model="I.paramsPre.page" tabindex="5" type="text" @keydown.enter="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'上一页'" panel right tabindex="4" @click="atFetch(-1)" @keydown.enter.space="atFetch(-1)">
				<Fas icon="angle-double-left" />
			</p-part>

			<p-part v-tip.bottom="'全部下载'" tabindex="3" panel right @click="IA.saveAll(I.illustsNow)" @keydown.enter.space="IA.saveAll(I.illustsNow)">
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



	/** @type {import('vue').Ref<import('../admin/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));

	const isFetching = ref(false);
	const atFetch = async step_ => {
		const tabNow = now.value;
		const info = tabNow.info;

		isFetching.value = true;
		try {
			const { page } = updatePage(info.paramsPre, step_);
			info.illustsNow = await IA.value.fetchFollow(page);


			tabNow.title = `【我的关注】（第${page}页）`;
			info.params.page = page;
		}
		finally {
			isFetching.value = false;
		}
	};


	const atChangeTab = () => {
		const tab = TA.value.now;
		const params = TA.value.params;

		if(tab.typeList != 'follow') { return; }


		now.value = tab;
		const [sInitTab] = params;

		if(sInitTab === TA.value.sInitTab) {
			tab.info.params = { page: 1 };
			tab.info.paramsPre = { page: 1 };
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