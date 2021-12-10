<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-illusts>
			<template v-for="(illust, index) of illusts" :key="`illust-${illust.iid}`">
				<p-illust
					:title="`${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('、')}`"
					:style="{
						backgroundImage: `url(api/picov/illust/thumb?who=${profile.name}&iid=${illust.iid}&time=${illust.time}&type=${illust.type})`,
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
	import { inject, watch } from 'vue';


	const profile = inject('profile');
	const wock = inject('$wock');

	const IS = inject('IS');

	const illusts = IS.illusts;
	const state = IS.state;


	watch(IS.page, page => IS.getFollow(profile.value, page), { immediate: true });


	const atSave = illust => wock.cast('picov/illust/save', illust, profile.value.name, true);
</script>

<style lang="sass" scoped>
p-illust
	@apply inblock relative bg-green-200 bg-no-repeat bg-top bg-cover bg-auto text-center cursor-pointer bg-blend-hue

	max-height: calc(100vh / 3)

	width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 3)
	height: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 3)

	@media (min-width: 768px)
		width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 4)
		height: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 4)

	@media (min-width: 1280px)
		width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 5)
		height: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 5)

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
		@apply absolute w-full h-6 left-0 top-0 opacity-70

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