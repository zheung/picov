<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-header>
			<p-button v-tip.bottom="'上一页'" tabindex="4" @click="prevPage()" @keydown.enter.space="prevPage()">
				<Fas icon="angle-double-left" />
			</p-button>
			<p-button v-tip.bottom="'当前页'" expand>
				<Fas icon="book-open" />
				<input v-model="pagePre" tabindex="5" type="text" @keydown.enter="jumpPage(pagePre)" />
			</p-button>
			<p-button v-tip.bottom="'下一页'" tabindex="6" @click="nextPage()" @keydown.enter.space="nextPage()">
				<Fas icon="angle-double-right" />
			</p-button>
		</p-header>

		<p-illusts>
			<template v-for="(illust, index) of illusts" :key="`illust-${illust.iid}`">
				<p-illust
					:title="`${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('、')}`"
					:style="{
						backgroundImage: `url(api/picov/illust/thumb?who=${who}&iid=${illust.iid}&time=${illust.time}&type=${illust.type})`,
						zIndex: illusts.length-index
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
	import { inject, ref, watch } from 'vue';


	const $get = inject('$get');
	const wock = inject('$wock');

	const who = inject('who');
	const IS = inject('IS');


	const illusts = ref([]);
	const state = IS.state;

	const fetchList = async page => {
		illusts.value = await $get('picov/illust/listFollow', { who: who.value, page });

		wock.cast('picov/illust/pull', illusts.value.map(illust => illust.iid), who.value);
	};


	const page = ref(1);
	const pagePre = ref(1);
	const nextPage = () => page.value++;
	const prevPage = () => page.value > 1 ? page.value-- : page.value;
	const jumpPage = pageNew => page.value = ~~pageNew;

	watch(page, pageNew => fetchList(pagePre.value = pageNew), { immediate: true });


	const atSave = illust => wock.cast('picov/illust/save', illust, who.value, true);
</script>

<style lang="sass" scoped>
p-header
	@apply absolute block w-full h-12 bg-blue-200 text-right z-20 shadow-mdd

	p-button
		@apply relative inblock rounded-md text-center text-xl shadow-mdd mr-2 cursor-pointer outline-none mt-1
		width: calc( var(--widthSidebar) - 1rem)
		height: calc( var(--widthSidebar) - 1rem)
		line-height: calc( var(--widthSidebar) - 1rem)
		background-color: var(--colorTextMain)
		color: var(--colorText)

		&:focus
			@apply ring-2 ring-yellow-600

		&[expand]
			@apply px-1 w-24

			&:focus-within
				@apply ring-2 ring-yellow-600

			input
				@apply rounded-md w-full text-center outline-none z-20 bg-transparent

			svg
				@apply absolute opacity-25 z-10 text-xs top-0.5 left-0.5

		&[keyword]:focus-within
			@apply w-48

		&[now]
			@apply ring-4 ring-yellow-600

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