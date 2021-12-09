<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<p-illusts>
			<template v-for="(illust, index) of illusts" :key="`illust-${illust.iid}`">
				<p-illust
					:style="{
						backgroundImage: `url(api/picov/illust/thumb?who=${profile.name}&iid=${illust.iid}&time=${illust.time}&type=${illust.type})`,
						zIndex: illusts.length-index
					}"
					@click.exact="atSave(illust)"
				>
					<p-title :title="illust.title">{{illust.count>1 ? `(${illust.count})` : ''}} {{illust.title}}</p-title>
					<p-title>{{state[illust.iid]?.sizeAll}}: {{state[illust.iid]?.progress}}</p-title>
					<p-progress>
						<p-size></p-size>
						<p-state></p-state>
						<progress :max="state[illust.iid]?.sizeAll ??0" :value="state[illust.iid]?.progress??0" />
					</p-progress>
				</p-illust>
			</template>
		</p-illusts>
	</module>
</template>

<script setup>
	import { inject, onBeforeMount, } from 'vue';
	import IS from './Illusts.js';

	const profile = inject('profile');
	const wock = inject('$wock');

	const illusts = IS.list;
	const state = IS.state;


	onBeforeMount(async () => IS.getFollow(profile.value, 1));


	const atSave = illust => wock.cast('picov/illust/save', illust, profile.value.name);
</script>

<style lang="sass" scoped>
p-illust
	@apply inblock relative bg-green-200 bg-no-repeat bg-top bg-cover bg-auto text-center bg-blend-hue cursor-pointer

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
		@apply block w-full px-4 elli text-gray-700 select-none

		&:hover
			@apply overflow-visible bg-gray-300 min-w-full
			width: fit-content

	p-progress
		@apply block absolute bottom-0 w-full h-6 leading-6 bg-green-500 opacity-40

		progress
			@apply w-full h-full

			&::-webkit-progress-bar
				background-color: var(--colorBackground)
			&::-webkit-progress-value
				background-color: var(--colorOkay)
</style>