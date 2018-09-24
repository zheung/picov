<template>
	<div class="compPager nosel transAll">
		<div class="side inline" @click="onOffset(-1)">
			<Fas icon="chevron-left"></Fas>
		</div>
		<input type="text" class="value inline" @input="onInput" v-bind:value="value" />
		<div class="side inline" @click="onOffset(1)">
			<Fas icon="chevron-right"></Fas>
		</div>
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

			value: {},
			place: {},

			regexp: {},

			onoffset: {}
		},
		data: function() {
			let label_ = this.label || this.conf.label || '';
			let labelWidth_ = this['label-width'] || this.conf.labelWidth || 0;
			let labelAlign_ = this['label-align'] || this.conf.labelAlign || 'left';

			let multi_ = this.multi || this.conf.multi || 1;
			let width_ = this.width || this.conf.width || 100;
			let place_ = this.place || this.conf.place || '';

			width_ = width_ * multi_ + (multi_ - 1) * (labelWidth_+4) - 30;

			return {
				label_,
				labelWidth_,
				labelAlign_,

				width_,

				place_,

				minWidth: this.conf.minWidth || width_+29,

				showSection: false,

				invalid: false
			};
		},

		methods: {
			onInput: function(event) {
				this.$emit('input', event.target.value);
			},
			onOffset: function(offset) {
				let now = this.value+offset;

				if(now > 0) {
					this.$emit('input', now);

					if(this.onoffset && typeof this.onoffset == 'function') {
						this.onoffset(now);
					}
				}
			},
		}
	};
</script>

<style scoped>
	.compPager {
		display: inline-block;
		vertical-align: top;

		font-size: 0;

		white-space: nowrap;
		text-overflow: ellipsis;

		overflow: hidden;
	}
	.compPager>* {
		font-size: 12px;

		height: 22px;

		line-height: 20px;
	}

	.side {
		box-sizing: border-box;

		width: 40px;

		border: 1px solid transparent;
		border-radius: 4px;

		line-height: 20px;
		text-align: center;

		cursor: pointer;
	}
	.side:hover {
		border: 1px solid #2e3235;
	}

	.value {
		box-sizing: border-box;

		width: 40px;

		padding: 0px;

		border: 1px solid transparent;

		outline: none;

		background: transparent;

		text-align: center;
	}
	.value:focus {
		border-bottom: 1px solid gray;
	}
</style>