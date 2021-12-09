<template>
	<module class="mx-auto overflow-x-hidden overflow-y-auto">
		<p-illusts>
			<template v-for="illust of illusts" :key="`illust-${illust.iid}`">
				<p-illust
					:style="{ backgroundImage: `url(api/picov/illust/thumb?who=${who.name}&iid=${illust.iid}&time=${illust.time}&type=${illust.type})` }"
				>
					{{illust.iid}}
				</p-illust>
			</template>
		</p-illusts>
	</module>
</template>

<script setup>
	import { inject, onBeforeMount, } from 'vue';
	import I from './Illusts.js';

	const who = inject('who');

	const illusts= I.list;

	onBeforeMount(async () => {
		I.getFollow(who.value, 1);
	});
</script>

<style lang="sass" scoped>
p-illusts
	@apply block w-full h-full text-center flex flex-row flex-wrap flex-auto justify-around
p-illust
	@apply block w-36 h-36 md:w-48 md:h-48 lg:w-60 lg:h-60 bg-green-200 bg-no-repeat bg-top bg-cover bg-auto filter text-center
	--tw-brightness: brightness(0.2)
</style>