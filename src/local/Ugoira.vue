<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Icon v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part>本地动画</p-part>

			<p-part v-tip.bottom="'位置'" panel input _mode>
				<Icon :icon="faCaretDown" corner />
				<Combo v-model="I.locationPre" :list="listLocation" align="center" drop-align="left" @update:model-value="atFetch()" />
			</p-part>

			<p-part v-tip.bottom="'刷新'" panel right @click="atFetch()"><Icon :icon="faSync" /></p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" @scroll="atScroll" />
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, provide, ref } from 'vue';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faSync, faCaretDown } from '@fortawesome/free-solid-svg-icons';


	import { Combo } from '@nuogz/vue-components';

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
			info.iids = await IA.value.getLocalUgoiraIIDs(info.locationPre, false);
			info.illustsNow = info.iids.length ? await IA.value.getLocalIllusts(info.iids) : [];
			info.illustsNow.sort((a, b) => b.iid - a.iid);


			info.location = info.locationPre;

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

			tab.info.location = 'prepare';

			tab.info.locationPre = 'prepare';


			atFetch();
		}
	});

	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());


	const listLocation = [
		{ text: '预备', value: 'prepare' },
		{ text: '存档', value: 'archive' },
	];
</script>

<style lang="sass" scoped>
[_mode]
	@apply w-24
</style>
