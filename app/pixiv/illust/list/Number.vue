<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Fas v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part>搜索ID</p-part>

			<p-part v-tip.bottom="'刷新'" panel right @click="atFetch()"><Fas icon="sync" /></p-part>

			<p-part v-if="I.illustsNow.length" right><Fas icon="save" /> {{counter}}</p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" @scroll="atScroll" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, provide, ref } from 'vue';

	import { Tab } from '../../../lib/TabAdmin.js';

	import Illusts from './utility/Illusts.vue';
	import Topbar from './utility/Topbar.vue';

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
	const atFetchNew = async iid => {
		const tabNow = now.value;
		const info = tabNow.info;

		stateFetch.value = 1;
		try {
			info.iids.unshift(iid);
			info.illustsNow.unshift(...await IA.value.fetchIllusts([iid]));

			stateFetch.value = 2;


			tabNow.scrollTop = 0;
			updateScrollTop(tabNow);
		}
		catch(error) {
			stateFetch.value = 3;

			throw error;
		}
	};
	const atFetch = async () => {
		const tabNow = now.value;
		const info = tabNow.info;

		stateFetch.value = 1;
		try {
			info.illustsNow = await IA.value.fetchIllusts(info.iids);

			stateFetch.value = 2;


			tabNow.scrollTop = 0;
			updateScrollTop(tabNow);
		}
		catch(error) {
			stateFetch.value = 3;

			throw error;
		}
	};


	onMounted(() => TA.value.emitChange());

	TA.value.addChanger('number', tab => {
		now.value = tab;


		if(!tab.info.isInit) {
			tab.info.isInit = true;

			tab.title = '【搜索ID】';

			tab.info.illustsNow = [];

			tab.info.iids = [];
		}

		const [iid] = tab.params;

		if(iid) {
			atFetchNew(iid);
		}
	});
</script>

<style lang="sass" scoped>
</style>
