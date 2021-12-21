<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-header>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> </p-part>
			<p-part v-if="I.illustsNow.length" :title="I.params.uid">搜索</p-part>

			<p-button v-tip.bottom="'关键词'" input keyword>
				<Fas icon="search" />
				<input v-model="I.paramsPre.keyword" tabindex="4" type="text" @keydown.enter="atFetch" />
			</p-button>
			<p-part v-if="I.illustsNow.length">{{counter}}</p-part>

			<p-button ref="nextPager" v-tip.bottom="'下一页'" right tabindex="7" @click="nextPage()" @keydown.enter.space="nextPage()">
				<Fas icon="angle-double-right" />
			</p-button>
			<p-button v-tip.bottom="'当前页'" right input>
				<Fas icon="book-open" />
				<input v-model="I.paramsPre.page" tabindex="6" type="text" @keydown.enter="atFetch" />
			</p-button>
			<p-button v-tip.bottom="'上一页'" right tabindex="5" @click="prevPage()" @keydown.enter.space="prevPage()">
				<Fas icon="angle-double-left" />
			</p-button>
			<p-button v-tip.bottom="'全部下载'" right @click="IA.saveAll(I.illustsNow)"><Fas icon="download" /></p-button>
		</p-header>

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

	import Illust from '../Illust.vue';


	const $get = inject('$get');

	const who = inject('who');

	/** @type {import('../admin/IllustAdmin.js').default} */
	const IA = inject('IA');
	/** @type {import('../admin/TabAdmin.js').default} */
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

		const { keyword, page } = info.paramsPre;

		info.illustsNow = (await $get('pixiv/illust/list/search', { who: who.value, keyword, page })) ?? [];

		IA.pull(info.illustsNow);

		tabNow.title = `【搜索】${keyword}`;
		info.params.keyword = keyword;
		info.params.page = page;
	};


	const nextPage = () => {
		now.value.info.paramsPre.page++;
		atFetch();
	};
	const prevPage = () => {
		now.value.info.paramsPre.page > 1 ? now.value.info.paramsPre.page-- : void 0;
		atFetch();
	};



	const atUpdateTab = () => {
		const tab = TA.now.value;
		const params = TA.params.value;

		if(tab.typeList == 'search') {
			now.value = tab;
			const [keyword, sFirst] = params;

			if(sFirst === TA.sFirst) {
				tab.info.params = { keyword, page: 1 };
				tab.info.paramsPre = { keyword, page: 1 };

				atFetch();
			}
		}
	};

	watch(TA.now, atUpdateTab);
	onBeforeMount(atUpdateTab);

	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());
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