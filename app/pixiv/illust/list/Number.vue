<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> </p-part>
			<p-part>作品ID（{{I.params.iid}}）</p-part>

			<p-part v-if="I.illustsNow.length" right><Fas icon="save" /> {{counter}}</p-part>
		</Topbar>

		<Illusts :illusts="I.illustsNow" />
	</module>
</template>

<script setup>
	import { computed, inject, onBeforeMount, ref, watch } from 'vue';

	import { Tab } from '../admin/TabAdmin.js';

	import Illusts from './utility/Illusts.vue';
	import Topbar from './utility/Topbar.vue';


	/** @type {import('vue').Ref<import('../admin/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const atFetch = async () => {
		const tabNow = now.value;
		const info = tabNow.info;


		const { iid } = info.paramsPre;
		info.illustsNow = await IA.value.fetchIllusts([iid]);


		tabNow.title = `【数字】（${iid}）${info.illustsNow[0]?.title ?? ''}`;
	};


	const atChangeTab = () => {
		const tab = TA.value.now;
		const params = TA.value.params;

		if(tab.typeList != 'number') { return; }


		now.value = tab;
		const [iid, sInitTab] = params;

		if(sInitTab === TA.value.sInitTab) {
			tab.info.params = { iid };
			tab.info.paramsPre = { iid };

			atFetch();
		}
	};

	watch(() => TA.value.now, atChangeTab);
	onBeforeMount(atChangeTab);
</script>

<style lang="sass" scoped>
</style>