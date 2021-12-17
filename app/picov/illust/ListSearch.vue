<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-header>
			<p-button v-tip.bottom="'关键词'" input keyword>
				<Fas icon="search" />
				<input v-model="now.info.paramsPre.keyword" tabindex="4" type="text" @keydown.enter="atFetch" />
			</p-button>
			<p-button v-tip.bottom="'下一页'" right tabindex="7" @click="nextPage()" @keydown.enter.space="nextPage()">
				<Fas icon="angle-double-right" />
			</p-button>
			<p-button v-tip.bottom="'当前页'" right input>
				<Fas icon="book-open" />
				<input v-model="now.info.paramsPre.page" tabindex="6" type="text" @keydown.enter="atFetch" />
			</p-button>
			<p-button v-tip.bottom="'上一页'" right tabindex="5" @click="prevPage()" @keydown.enter.space="prevPage()">
				<Fas icon="angle-double-left" />
			</p-button>
		</p-header>

		<p-illusts>
			<template v-for="(illust, index) of now.illusts" :key="`illust-${illust.iid}`">
				<p-illust
					:title="`${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('、')}`"
					:style="{
						backgroundImage: `url(api/picov/illust/thumb?who=${who}&iid=${illust.iid}&time=${illust.time}&type=${illust.type})`,
						zIndex: now.illusts.length-index
					}"
					@click.exact="atSave(illust)"
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
	import { inject, onBeforeMount, ref } from 'vue';


	const $get = inject('$get');
	const wock = inject('$wock');

	const who = inject('who');
	/** @type {import('./admin/IllustAdmin.js').default} */
	const IS = inject('IS');
	/** @type {import('./admin/TabAdmin.js').default} */
	const TA = inject('TA');


	const now = ref({ illusts: [] });

	const state = IS.state;

	const atFetch = async () => {
		const info = now.value.info;

		const { keyword, page } = info.paramsPre;

		info.illusts = (await $get('picov/illust/listSearch', { who: who.value, keyword, page })) ?? [];

		IS.pull(info.illusts);

		info.params.keyword = keyword;
		info.params.page = page;
	};


	const page = ref(1);
	const nextPage = () => now.value.info.paramsPre.page++ && atFetch();
	const prevPage = () => page.value > 1 ? page.value-- : page.value;



	const atSave = illust => wock.cast('picov/illust/save', illust, who.value, true);


	const atUpdateTab = () => {
		const tabNew = TA.now.value;
		const params = TA.params.value;

		if(tabNew.typeList == 'search') {
			const [keyword, sFirst] = params;

			if(sFirst === TA.sFirst) {
				tabNew.info.illusts = [];
				tabNew.info.params = { keyword, page: 1 };
				tabNew.info.paramsPre = { keyword, page: 1 };

				atFetch();
			}

			now.value = tabNew;
		}
	};

	// watch(page, pageNew => atFetch(pagePre.value = pageNew));

	onBeforeMount(atUpdateTab);



</script>

<style lang="sass" scoped>
p-header
	@apply absolute block w-full h-12 bg-blue-200 z-20 shadow-mdd

	p-button
		@apply relative inblock rounded-md text-center text-xl ml-2 mr-0 shadow-mdd cursor-pointer outline-none mt-1
		width: calc( var(--widthSidebar) - 1rem)
		height: calc( var(--widthSidebar) - 1rem)
		line-height: calc( var(--widthSidebar) - 1rem)
		background-color: var(--colorTextMain)
		color: var(--colorText)

		&:focus
			@apply ring-2 ring-yellow-600

		&[right]
			@apply float-right ml-0 mr-2

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
		@apply inblock relative bg-green-200 bg-no-repeat bg-top bg-cover bg-auto text-center cursor-pointer bg-blend-hue

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