<template>
	<div class="compChecker nosel transAll" :style="{ width: width_? width_+'px' : false, 'text-align': align_ }" @click="onClick">
		<input type="checkbox" class="value" @input="onInput" v-bind:checked="value" ref="cb" />
		<div class="label">{{label_}}</div>
	</div>
</template>

<script>
	export default {
		props: {
			conf: { default: function() { return {}; } },

			label: {},
			'label-width': {},
			'label-align': {},

			multi: {},
			width: {},

			value: {}
		},
		data: function() {
			let label_ = this.label || this.conf.label || '';

			let width_ = (this.width || this.conf.width || 20) - 20;
			let align_ = this['label-align'] || this.conf.labelAlign || 'left';

			return {
				label_,
				align_,
				width_,
			};
		},
		methods: {
			onInput: function(event) {
				this.$emit('input', event.target.checked);
			},
			onClick: function(eve) {
				if(this.$refs.cb != eve.target) {
					this.$refs.cb.click();
				}
			}
		},

		components: {
		},

		mounted: function() {
		},
	};
</script>

<style scoped>
	.compChecker {
		display: inline-block;
		vertical-align: top;

		height: 20px;

		border: 1px solid transparent;

		padding: 0px 10px 0px 10px;

		border-radius: 3px;

		cursor: pointer;

		font-size: 0;

		overflow: hidden;
	}
	.compChecker:hover {
		background: #cdeeff;;
	}
	.compChecker>* {
		font-size: 12px;
	}
	.label {
		display: inline-block;
		vertical-align: top;

		height: 20px;

		line-height: 20px;
	}

	.value {
		display: inline-block;

		width: 15px;

		padding: 0px;
		margin: 2px 5px 0px 0px;

		border: 0;
		outline: none;

		background: transparent;

		font-size: 12px;
		color: #495051;

		height: 20px;
		line-height: 20px;

		margin-top: 2px;
		margin-right: 7px;
	}
</style>