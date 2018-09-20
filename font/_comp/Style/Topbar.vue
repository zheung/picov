<template>
	<sPanel class="compStyleTopbar" padding="5px">
		<slot></slot>
	</sPanel>
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
	.compStyleTopbar {
		border-left: 5px solid #1faaf1 !important;
	}

	dxxp>* {
		font-size: 12px;
	}
	dxxp>.onLeft {
		margin-right: 5px;
	}
	dxxp>.onRight {
		float: right;

		margin-left: 5px;
	}
</style>