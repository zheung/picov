<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> </p-part>
			<p-part>作品ID（{{I.params.iid}}）</p-part>

			<p-part v-if="I.illustsNow.length" right><Fas icon="save" /> {{counter}}</p-part>
		</Topbar>

		<p-illusts>
			<Illust v-for="(illust, index) of I.illustsNow" :key="`illust-${illust.iid}`"
				:illust="illust" :z-index="I.illustsNow.length - index"
			/>
		</p-illusts>
	</module>
</template>

<script setup>
	import { computed, inject, onBeforeMount, ref, watch } from 'vue';

	import { Tab } from '../admin/TabAdmin.js';

	import Illust from './utility/Illust.vue';
	import Topbar from './utility/Topbar.vue';


	const $get = inject('$get');

	const who = inject('who');


	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('IA');
	/** @type {import('../admin/TabAdmin.js').default} */
	const TA = inject('TA');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const atFetch = async () => {
		const tabNow = now.value;
		const info = tabNow.info;


		const { iid } = info.paramsPre;


		info.illustsNow = (await $get('pixiv/illust/list/illust', { who: who.value, iids: [iid] })) ?? [];

		IA.value.watch(info.illustsNow);


		tabNow.title = `【数字】（${iid}）${info.illustsNow[0]?.title ?? ''}`;
	};


	const atChangeTab = () => {
		const tab = TA.now.value;
		const params = TA.params.value;

		if(tab.typeList != 'number') { return; }


		now.value = tab;
		const [iid, sInitTab] = params;

		if(sInitTab === TA.sInitTab) {
			tab.info.params = { iid };
			tab.info.paramsPre = { iid };

			atFetch();
		}
	};

	watch(TA.now, atChangeTab);
	onBeforeMount(atChangeTab);
</script>

<style lang="sass" scoped>
p-illusts
	@apply block mt-12 z-10 w-full overflow-x-hidden overflow-y-scroll
	height: calc(100vh - 3rem)
</style>