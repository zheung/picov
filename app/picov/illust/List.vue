<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-illusts>
			<template v-for="(illust, index) of illusts" :key="`illust-${illust.iid}`">
				<p-illust
					:title="illust.iid"
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
						<progress :max="state[illust.iid]?.sizeAll ??0" :value="state[illust.iid]?.progress??0" />
					</template>
					<p-title
						:title="illust.title"
						:multi="brop(illust.count>1)"
					>
						{{illust.count > 1 ? `(${illust.count})` : ''}} {{illust.title}}
					</p-title>
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


	const atSave = illust => wock.cast('picov/illust/save', illust, profile.value.name);
</script>

<style lang="sass" scoped>
p-illust
	@apply inblock relative bg-green-200 bg-no-repeat bg-top bg-cover bg-auto text-center cursor-pointer

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
			@apply text-yellow-600
		&[ugoira]
			@apply text-purple-600

	progress
		@apply absolute w-full h-6 left-0 top-0 opacity-70

		&::-webkit-progress-bar
			background-color: var(--colorBackground)
		&::-webkit-progress-value
			background-color: var(--colorOkay)

</style>