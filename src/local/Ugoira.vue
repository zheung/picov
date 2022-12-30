<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Fas v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part>本地新动画</p-part>


			<p-part v-tip.bottom="'刷新'" panel right @click="atFetch()"><Fas :icon="faSync" /></p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" @scroll="atScroll" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, provide, ref } from 'vue';

	import { faSync } from '@fortawesome/free-solid-svg-icons';

	import { Tab } from '../lib/TabAdmin.js';


	import Illusts from '../pixiv/illust/list/utility/Illusts.vue';
	import Topbar from '../pixiv/illust/list/utility/Topbar.vue';

	import { stateFetchIcon } from '../pixiv/illust/list/utility/stateFetch.js';



	/** @type {import('vue').Ref<import('../lib/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../pixiv/illust/admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');


	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const recoverScrollTop = ref(null);
	provide('recoverScrollTop', recoverScrollTop);
	const updateScrollTop = tab => recoverScrollTop.value = [tab];
	onActivated(() => updateScrollTop(now.value));

	const atScroll = top => now.value.scrollTop = top;


	const stateFetch = ref(0);
	const atFetch = async (step_ = 0) => {
		const tabNow = now.value;
		const info = tabNow.info;


		stateFetch.value = 1;
		try {
			info.iids = await IA.value.getLocalUgoira(false);

			info.illustsNow = info.iids.length ? await IA.value.getLocalIllusts(info.iids) : [];

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
