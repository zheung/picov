<template>
	<sPanel class="compThumb" :title="illust.title">
		<div
			class="img"
			:style="{ backgroundImage: 'url(uapi/thumb?iid='+illust.iid+'&time='+illust.time+'&ugoira='+illust.ugoira+')' }"
		>
		</div>
	</sPanel>
</template>

<script>
	export default {
		props: {
			illust: { default: {} }
		},
		data: function() {
			return {};
		},

		methods: {
		}
	};
</script>

<style scoped>
	.compThumb>.img {
		width: calc(100% - 20px);
		height: calc(100% - 30px);

		margin: 10px;

		box-sizing: border-box;

		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
	}
</style>