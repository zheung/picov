<template>
	<div class="compButton nosel trans">
		{{text}}
	</div>
</template>

<script>
	export default {
		props: {
			text: {},
		},
		data: function() {
			return {};
		}
	};
</script>

<style scoped>
	.compButton {
		width: 40px;
		height: 20px;

		border: 1px solid transparent;

		border-radius: 4px;

		color: snow;
		background: #1faaf1;

		line-height: 20px;

		overflow: hidden;
		text-align: center;

		cursor: pointer;
	}
	.compButton:hover {
		box-shadow: 1px 1px 4px -1px #3d94d4;

		border: 1px solid #3d94d4;
	}
</style>