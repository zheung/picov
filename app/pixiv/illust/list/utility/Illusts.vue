<template>
	<p-illusts ref="domIllusts" @scroll="atScroll">
		<Illust v-for="(illust, index) of illusts" :key="`illust-${illust.iid}`"
			:illust="illust"
			:tab-index="illusts.length - index"
		/>
	</p-illusts>
</template>

<script setup>
	import { inject, ref, watch } from 'vue';

	import Illust from './Illust.vue';


	defineProps({
		illusts: { type: Array, default: () => [] },
	});

	const emit = defineEmits(['scroll']);


	const domIllusts = ref(null);

	const atScroll = event => {
		emit('scroll', event.target.scrollTop, event.target, event);
	};

	const recoverScrollTop = inject('recoverScrollTop');

	if(recoverScrollTop) {
		watch(recoverScrollTop, () => domIllusts.value.scrollTop = recoverScrollTop.value[0].scrollTop ?? 0);
	}
</script>

<style lang="sass" scoped>
p-illusts
	@apply block mt-12 z-10 w-full overflow-x-hidden overflow-y-scroll
	height: calc(100vh - 3rem)
	scroll-snap-type: y
	scroll-snap-stop: always
</style>