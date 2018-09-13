<template>
	<div class="compTexter nosel transAll">
		<div class="label nosel" v-if="label_"
			:style="{ width: labelWidth_? labelWidth_+'px' : false, 'text-align': labelAlign_ }"
		>
			{{ label_ ? label_+'：' : label_ }}
		</div>
		<div class="box" :style="{ width: width_+'px' }" :class="{ inva: invalid }">
			<input :type="type_" class="value"
				@input="onInput" v-bind:value="value" :placeholder="place_"
				@focus="onFocus" @blur="onBlur"
			/>
			<Fas class="rightButton"
				:icon="value ? ['fas', 'times-circle'] : ['fas', 'pencil-alt']"
				@click="onClear"
			/>
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
			type: {},

			regexp: {}
		},
		data: function() {
			let label_ = this.label || this.conf.label || '';
			let labelWidth_ = this['label-width'] || this.conf.labelWidth || 0;
			let labelAlign_ = this['label-align'] || this.conf.labelAlign || 'left';

			let multi_ = this.multi || this.conf.multi || 1;
			let width_ = this.width || this.conf.width || 100;
			let place_ = this.place || this.conf.place || '';

			let type_ = this.type || this.conf.type || '';

			width_ = width_ * multi_ + (multi_ - 1) * (labelWidth_+4) - 30;

			if(type_ == 'pass') {
				type_ = 'password';
			}
			else if(type_ != 'text') {
				type_ = 'text';
			}

			return {
				label_,
				labelWidth_,
				labelAlign_,

				width_,

				place_,

				type_,

				minWidth: this.conf.minWidth || width_+29,

				showSection: false,

				invalid: false
			};
		},
		methods: {
			onFocus: function() {
				this.$emit('focus', '');
			},
			onBlur: function() {
				this.$emit('blur', '');
			},
			onInput: function(event) {
				this.$emit('input', event.target.value);
			},
			onClear: function() {
				this.$emit('input', '');
			}
		},

		watch: {
			value: function(now) {
				if(this.regexp instanceof RegExp) {
					this.invalid = !this.regexp.test(now);
				}
			}
		}
	};
</script>

<style scoped>
	.compTexter {
		display: inline-block;
		vertical-align: top;

		cursor: pointer;

		font-size: 0;

		white-space: nowrap;
		text-overflow: ellipsis;

		overflow: hidden;
	}
	.compTexter>* {
		font-size: 12px;
	}
	.label {
		display: inline-block;
		vertical-align: top;

		height: 20px;

		line-height: 20px;
		border: 1px solid transparent;
	}
	.box {
		position: relative;

		display: inline-block;

		vertical-align: top;

		border: 1px solid lightgray;
		width: auto;
		height: 20px;
		line-height: 20px;
		border-radius: 4px;

		padding-left: 10px;
		padding-right: 20px;
	}
	.box:hover {
		border-color: gray;
	}
	.box.opened:hover {
		border-color: lightgray;
	}
	.box.inva {
		border-color: orangered;
	}

	.rightButton {
		position: absolute;

		bottom: 0px;
		right: 0px;

		height: 20px;
		color: gray;
		padding-right: 4px;
		padding-left: 4px;
		cursor: pointer;
	}
	.rightButton:hover, .rightButton.hover {
		color: inherit;
	}

	.value {
		display: inline-block;

		width: 100%;

		border: 0;
		outline: none;

		background: transparent;

		font-size: 12px;
		color: #495051;

		height: inherit;
		line-height: inherit;
		padding: 0px;
	}

	.section {
		position: absolute;
		top: 20px;
		left: -1px;
		z-index: 100;
		border: 1px solid lightgray;
		background: snow;
		max-height: 200px;
		overflow-x: hidden;
		overflow-y: auto;
		border-radius: 3px;
		padding-top: 10px;
		padding-bottom: 10px;

		outline: none;

		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 0.7);
	}

	.section>div {
		height: 24px;
		line-height: 24px;
		max-width: 280px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		padding-left: 10px;
		padding-right: 10px;
	}
	.section>div.selected {
		color: #1faaf1;
	}
	.section>div:hover {
		background: #f1f1f1;
		color: #1faaf1;
	}
</style>