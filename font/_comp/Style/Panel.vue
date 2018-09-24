<template>
	<div class="compPanel" :style="{ padding: padding }">
		<div class="panelTitle" v-if="title" :style="{ color: titlecolor }">{{title+''}}</div>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			title: {},
			titlecolor: { default: '#0285e6' },
			padding: { default: '0px 10px 10px 10px' },
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

		border: 1px solid #2e3235;

		border-radius: 4px;

		overflow: hidden;
	}

	.compPanel>.panelTitle {
		position: relative;

		padding: 0px;

		border-bottom: 1px solid #2e3235;

		width: 100%;
		height: 30px;

		color: gray;
		font-size: 14px;
		font-weight: bold;
		line-height: 30px;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>