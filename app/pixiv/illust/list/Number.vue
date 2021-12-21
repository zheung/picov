<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-header>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> </p-part>
			<p-part :title="I.params.uid">搜索作品ID（{{I.params.uid}}）</p-part>

			<p-part v-if="I.illustsNow.length">{{counter}}</p-part>
		</p-header>

		<p-illusts>
			<Illust v-for="(illust, index) of I.illustsNow" :key="`illust-${illust.iid}`"
				:illust="illust" :z-index="I.illustsNow.length - index"
			/>
		</p-illusts>
	</module>
</template>

<script setup>
	import { computed, inject, onBeforeMount, ref, watch } from 'vue';

	import { Tab } from './admin/TabAdmin.js';

	import Illust from './Illust.vue';


	const $get = inject('$get');

	const who = inject('who');

	/** @type {import('./admin/IllustAdmin.js').default} */
	const IA = inject('IA');
	/** @type {import('./admin/TabAdmin.js').default} */
	const TA = inject('TA');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);

	const state = IA.state;

	const counter = computed(() => {
		const illustsNow = I.value.illustsNow;

		const countAll = illustsNow.reduce((acc, cur) => acc + cur.count, 0);
		const iids = illustsNow.map(i => i.iid);
		const states = Object.entries(state.value).filter(([iid]) => iids.includes(~~iid)).map(([, state]) => state);
		const countFetched = states.reduce((acc, state) => acc + (state.fetch == 1
			? (illustsNow.find(i => i.iid == state.iid).count ?? 0)
			: (state.fetched ?? 0)
		), 0);
		return `共 ${countAll}（${countAll - countFetched}）张`;
	});
	const atFetch = async () => {
		const tabNow = now.value;
		const info = tabNow.info;

		const { uid } = info.paramsPre;

		info.illustsNow = (await $get('pixiv/illust/listIllust', { who: who.value, iids: [uid] })) ?? [];

		IA.pull(info.illustsNow);

		tabNow.title = `【数字】（${uid}）${info.illustsNow[0]?.title ?? ''}`;
	};


	const atUpdateTab = () => {
		const tab = TA.now.value;
		const params = TA.params.value;

		if(tab.typeList == 'number') {
			now.value = tab;
			const [uid, sFirst] = params;

			if(sFirst === TA.sFirst) {
				tab.info.params = { uid };
				tab.info.paramsPre = { uid };

				atFetch();
			}
		}
	};

	watch(TA.now, atUpdateTab);
	onBeforeMount(atUpdateTab);
</script>

<style lang="sass" scoped>
p-header
	@apply absolute block w-full h-12 bg-blue-200 z-20 shadow-mdd

	>*
		@apply mt-1 ml-2 mr-0
		&[right]
			@apply float-right ml-0 mr-2
	p-part
		@apply inblock
		height: calc( var(--widthSidebar) - 1rem)
		line-height: calc( var(--widthSidebar) - 1rem)
	p-button
		@apply relative inblock rounded-md text-center text-xl shadow-mdd cursor-pointer outline-none
		width: calc( var(--widthSidebar) - 1rem)
		height: calc( var(--widthSidebar) - 1rem)
		line-height: calc( var(--widthSidebar) - 1rem)
		background-color: var(--colorTextMain)
		color: var(--colorText)

		&:focus
			@apply ring-2 ring-yellow-600


		&[input]
			@apply px-1 w-24

			&:focus-within
				@apply ring-2 ring-yellow-600

			input
				@apply rounded-md w-full text-center outline-none z-20 bg-transparent

			svg
				@apply absolute opacity-25 z-10 text-xs top-0.5 left-0.5

			&[keyword]
				@apply w-48

p-illusts
	@apply block mt-12 z-10 w-full overflow-x-hidden overflow-y-scroll
	height: calc(100vh - 3rem)
</style>