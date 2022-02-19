<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Fas v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part>我的关注</p-part>


			<p-part ref="nextPager" v-tip.bottom="'下一页'" panel right tabindex="6" @click="atFetch(1)" @keydown.enter.space="atFetch(1)">
				<Fas icon="angle-double-right" />
			</p-part>

			<p-part v-tip.bottom="'当前页'" panel right input _page>
				<Fas icon="book-open" corner />
				<input v-model="I.pagePre" tabindex="5" type="text" @keydown.enter="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'上一页'" panel right tabindex="4" @click="atFetch(-1)" @keydown.enter.space="atFetch(-1)">
				<Fas icon="angle-double-left" />
			</p-part>

			<p-part v-tip.bottom="'全部下载'" tabindex="3" panel right @click="IA.saveAll(I.illustsNow)" @keydown.enter.space="IA.saveAll(I.illustsNow)">
				<Fas icon="download" />
			</p-part>

			<p-part v-if="I.illustsNow.length" right><Fas icon="save" /> {{counter}}</p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" @scroll="atScroll" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, provide, ref } from 'vue';

	import { Tab } from '../admin/TabAdmin.js';

	import Illusts from './utility/Illusts.vue';
	import Topbar from './utility/Topbar.vue';

	import updatePage from './utility/updatePage.js';
	import { stateFetchIcon } from './utility/stateFetch.js';


	/** @type {import('vue').Ref<import('../admin/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const stateFetch = ref(0);
	const atFetch = async (step_ = 0) => {
		const tabNow = now.value;
		const info = tabNow.info;

		stateFetch.value = 1;
		try {
			const { pagePre } = updatePage(info, step_);
			info.illustsNow = await IA.value.fetchFollow(pagePre);
			stateFetch.value = 2;


			tabNow.title = `【我的关注】（第${pagePre}页）`;
			info.pagePre = pagePre;

			tabNow.scrollTop = 0;
		}
		catch(error) {
			stateFetch.value = 3;

			throw error;
		}
	};


	onMounted(() => TA.value.emitChange());

	TA.value.addChanger('follow', tab => {
		now.value = tab;


		if(!tab.info.isInit) {
			tab.info.isInit = true;

			tab.info.page = 0;
			tab.info.pagePre = 1;


			atFetch();
		}
	});


	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());


	const atScroll = top => now.value.scrollTop = top;

	const recoverScrollTop = ref(null);
	provide('recoverScrollTop', recoverScrollTop);
	onActivated(() => recoverScrollTop.value = [now.value]);
</script>

<style lang="sass" scoped>
</style>