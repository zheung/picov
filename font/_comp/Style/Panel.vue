<template>
	<div class="compPanel" :style="{ padding: padding }">
		<div class="panelTitle" v-if="title">{{title+''}}</div>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			title: {},
			padding: { default: '10px' },
		},
		data: function() {
			return {
			};
		}
	};
</script>

<style scoped>
	.compPanel {
		box-sizing: border-box;

		border: 1px solid #dedede;

		background: snow;

		border-radius: 4px;
		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 0.4);

		overflow: hidden;
	}

	.compPanel>.panelTitle {
		position: relative;

		padding: 0px;
		margin-bottom: 5px;

		border-bottom: 1px solid #0285e6;

		width: 100%;
		height: 20px;

		color: #0285e6;
		font-size: 14px;
		font-weight: bold;
		line-height: 20px;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>