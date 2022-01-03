<template>
	<p-illusts>
		<Illust v-for="(illust, index) of illusts" :key="`illust-${illust.iid}`"
			:illust="illust"
			:tab-index="illusts.length - index"
		/>
	</p-illusts>
</template>

<script setup>
	import Illust from './Illust.vue';

	defineProps({
		illusts: { type: Array, default: () => [] },
	});
</script>

<style lang="sass" scoped>
p-illusts
	@apply block mt-12 z-10 w-full overflow-x-hidden overflow-y-scroll
	height: calc(100vh - 3rem)
	scroll-snap-type: y
	scroll-snap-stop: always
</style>