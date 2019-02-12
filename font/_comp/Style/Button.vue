<template>
	<div class="compButton nosel trans inline" @click="onClick">
		{{ text}}
	</div>
</template>

<script>
	export default {
		props: {
			text: {
				type: [ String, Number ],
				default: ''
			},
		},
		data: function() {
			return {};
		},
		methods: {
			onClick: function(e) {
				this.$emit('click', e);
			}
		}
	};
</script>

<style scoped>
	.compButton {
		height: 20px;

		padding: 0px 10px;

		border: 1px solid #202224;

		border-radius: 4px;

		background: #202224;

		line-height: 20px;

		overflow: hidden;
		text-align: center;

		cursor: pointer;
	}
	.compButton:hover {
		color: lightgray;
	}
</style>