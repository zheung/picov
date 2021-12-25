<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Fas v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part>本地新动图库</p-part>


			<p-part v-tip.bottom="'刷新'" panel right @click="atFetch()"><Fas icon="sync" /></p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, ref } from 'vue';

	import { Tab } from '../admin/TabAdmin.js';

	import Illusts from './utility/Illusts.vue';
	import Topbar from './utility/Topbar.vue';

	import { stateFetchIcon } from './utility/stateFetch.js';


	/** @type {import('vue').Ref<import('../admin/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');


	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const stateFetch = ref(0);
	const atFetch = async (step_ = 0) => {
		const tabNow = now.value;
		const info = tabNow.info;


		stateFetch.value = 1;
		try {
			info.iids = await IA.value.getLocalUgoira(false);
			info.illustsNow = await IA.value.fetchIllusts(info.iids);
			stateFetch.value = 2;
		}
		catch(error) {
			stateFetch.value = 3;

			throw error;
		}
	};

	onMounted(() => TA.value.emitChange());

	TA.value.addChanger('local-ugoira', async tab_ => {
		const tab = tab_;


		now.value = tab;


		if(!tab.info.isInit) {
			tab.info.isInit = true;


			atFetch();
		}
	});

	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());
</script>

<style lang="sass" scoped>
</style>