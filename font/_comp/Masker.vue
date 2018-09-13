<template>
	<div class="compMasker" v-show="C.mask" :style="{ zIndex: C.mask }"></div>
</template>

<script>
	export default {
		props: {
		},
		components: {
		},
		data: function() {
			return X.init('Masker', { mask: 0 } );
		},
	};
</script>

<style scoped>
	.compMasker {
		position: fixed;

		top: 0;
		bottom: 0;
		left: 0;
		right: 0;

		background: rgba(192, 192, 192, 0.4);

		z-index: 3;
	}
</style>