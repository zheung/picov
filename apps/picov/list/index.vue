<template>
	<div>
		<Thumb
			v-for="(illust, illustIndex) of B.lists[B.typeListNow]" :key="`thumb-${illustIndex}`"
			class="Thumb inline"
			:illust="illust" :index="illustIndex"
		/>
	</div>
</template>

<script>
	import B from 'Bus';
	import Thumb from '../image/Thumb';

	export default {
		components: { Thumb },
		async mounted() {
			B.Vue.set(B.lists, 'follow', await A.conn('list/follow'));

			B.typeListNow = 'follow';
		}
	};
</script>

<style lang="sass" scoped>
.View
	font-size: $fs
	display: flex
	flex-flow: row wrap
	align-content: flex-start

.Thumb
	flex: 0 0 25%
</style>