<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> </p-part>
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

			<p-part v-if="I.illustsNow.length" right><Fas icon="paint-brush" /> {{counter}}</p-part>
		</Topbar>

		<p-illusts>
			<Illust v-for="(illust, index) of I.illustsNow" :key="`illust-${illust.iid}`"
				:illust="illust" :z-index="I.illustsNow.length - index"
			/>
		</p-illusts>
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onBeforeMount, ref, watch } from 'vue';

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


	const atFetch = async step_ => {
		const tabNow = now.value;
		const info = tabNow.info;


		const step = ~~step_;
		let { page } = info.paramsPre;

		if(step > 0 || step < 0 && page + step > 0) { page = (info.paramsPre.page += step); }


		info.illustsNow = (await $get('pixiv/illust/list/follow', { who: who.value, page })) ?? [];

		IA.value.watch(info.illustsNow);


		tabNow.title = `【我的关注】（第${page}页）`;
		info.params.page = page;
	};


	const atChangeTab = () => {
		const tab = TA.now.value;
		const params = TA.params.value;

		if(tab.typeList != 'follow') { return; }


		now.value = tab;
		const [sInitTab] = params;

		if(sInitTab === TA.sInitTab) {
			tab.info.params = { page: 1 };
			tab.info.paramsPre = { page: 1 };

			atFetch();
		}
	};

	watch(TA.now, atChangeTab);
	onBeforeMount(atChangeTab);

	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());
</script>

<style lang="sass" scoped>
p-illusts
	@apply block mt-12 z-10 w-full overflow-x-hidden overflow-y-scroll
	height: calc(100vh - 3rem)
</style>