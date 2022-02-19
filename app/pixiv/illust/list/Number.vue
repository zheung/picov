<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part><Fas v-if="stateFetchIcon[stateFetch]" :icon="stateFetchIcon[stateFetch]" :spin="stateFetch == 1" /> </p-part>
			<p-part>作品ID（{{I.iid}}）</p-part>

			<p-part v-tip.bottom="'刷新'" panel right @click="atFetch()"><Fas icon="sync" /></p-part>

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

	import { stateFetchIcon } from './utility/stateFetch.js';


	/** @type {import('vue').Ref<import('../admin/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const stateFetch = ref(0);
	const atFetch = async () => {
		const tabNow = now.value;
		const info = tabNow.info;

		stateFetch.value = 1;
		try {
			const iid = info.iid;
			info.illustsNow = await IA.value.fetchIllusts([iid]);
			stateFetch.value = 2;


			tabNow.title = `【作品】（${iid}）${info.illustsNow[0]?.title ?? ''}`;
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

			const [iid] = tab.params;

			tab.info.iid = iid;


			atFetch();
		}
	});


	const atScroll = top => now.value.scrollTop = top;

	const recoverScrollTop = ref(null);
	provide('recoverScrollTop', recoverScrollTop);
	onActivated(() => recoverScrollTop.value = [now.value]);
</script>

<style lang="sass" scoped>
</style>