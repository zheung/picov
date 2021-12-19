<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-header>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> </p-part>
			<p-part :title="I.params.uid">搜索作品ID（{{I.params.uid}}）</p-part>

			<p-part v-if="I.illustsNow.length">{{counter}}</p-part>
		</p-header>

		<p-illusts>
			<template v-for="(illust, index) of I.illustsNow" :key="`illust-${illust.iid}`">
				<p-illust
					v-menu="{ params: illust, ...menuIllust }"
					:title="`${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('、')}`"
					:style="{
						backgroundImage: `url(api/picov/illust/thumb?who=${who}&iid=${illust.iid}&time=${illust.time}&type=${illust.type})`,
						zIndex: I.illustsNow.length - index
					}"
					@click.exact="IS.save(illust)"
					@click.ctrl="IS.save(illust, true)"
				>
					<template v-if="state[illust.iid]?.fetch == 1">
						<progress :max="100" :value="100" />
					</template>
					<template v-else>
						<progress :max="state[illust.iid]?.progMax ?? 0" :value="state[illust.iid]?.prog ?? 0" />
					</template>
					<p-title
						:title="illust.title"
						:multi="brop(illust.count>1)"
						:ugoira="brop(illust.type ==2)"
					>
						{{illust.count > 1 ? `(${illust.count})` : ''}} {{illust.title}}
					</p-title>

					<p-state v-if="state[illust.iid]?.L" :title="state[illust.iid]?.L">{{state[illust.iid]?.L}}</p-state>
					<p-state v-if="state[illust.iid]?.R" right :title="state[illust.iid]?.R">{{state[illust.iid]?.R}}</p-state>
				</p-illust>
			</template>
		</p-illusts>
	</module>
</template>

<script setup>
	import { computed, inject, onBeforeMount, ref, watch } from 'vue';

	import { Tab } from './admin/TabAdmin.js';

	const $get = inject('$get');

	const who = inject('who');
	const menuIllust = inject('menuIllust');

	/** @type {import('./admin/IllustAdmin.js').default} */
	const IS = inject('IS');
	/** @type {import('./admin/TabAdmin.js').default} */
	const TA = inject('TA');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);

	const state = IS.state;

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

		info.illustsNow = (await $get('picov/illust/listIllust', { who: who.value, iids: [uid] })) ?? [];

		IS.pull(info.illustsNow);

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

	p-illust
		@apply inblock relative bg-green-200 bg-no-repeat bg-top bg-cover bg-auto text-center cursor-pointer

		max-height: calc(100% / 3)

		width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 3)
		height: calc(100% / 4)

		@media (min-width: 768px)
			width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 4)
			height: calc(100% / 4)

		@media (min-width: 1280px)
			width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 5)
			height: calc(100% / 3)

		p-title
			@apply relative block w-full h-6 leading-6 px-4 elli select-none
			color: var(--colorText)

			&:hover
				@apply text-black

			&[multi]
				@apply text-yellow-500
			&[ugoira]
				@apply text-purple-600

		progress
			@apply absolute w-full h-6 left-0 top-0 opacity-90

			&::-webkit-progress-bar
				background-color: var(--colorBackground)
			&::-webkit-progress-value
				background-color: var(--colorOkay)

		p-state
			@apply relative inblock float-left text-xs py-1 px-1 elli select-none opacity-70
			max-width: 50%
			color: var(--colorText)
			background-color: var(--colorBackground)

			&[right]
				@apply float-right
</style>