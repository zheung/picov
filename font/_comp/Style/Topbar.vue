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