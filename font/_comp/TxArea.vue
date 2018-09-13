<template>
	<div class="compTxArea nosel transAll">
		<div class="label nosel" v-if="label_"
			:style="{ width: labelWidth_? labelWidth_+'px' : false, 'text-align': labelAlign_ }"
		>
			{{ label_ ? label_+'：' : label_ }}
		</div>
		<div class="box" :style="{ width: width_+'px', height: (row*20+(row_-1)*20)+'px', borderColor: readonly_ ? 'transparent' : 'lightgray' }">
			<textarea type="text" class="value" :readonly="readonly_"
				@input="onInput" v-bind:value="value" :placeholder="place_"
			>
			</textarea>
			<Fas class="rightButton" v-if="!readonly_"
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
			row: {},

			value: {},

			readonly: {},

			place: {}
		},
		data: function() {
			let label_ = this.label || this.conf.label || '';
			let labelWidth_ = this['label-width'] || this.conf.labelWidth || 0;
			let labelAlign_ = this['label-align'] || this.conf.labelAlign || 'left';

			let multi_ = this.multi || this.conf.multi || 1;
			let width_ = this.width || this.conf.width || 100;
			let place_ = this.place || this.conf.place || '';

			width_ = width_ * multi_ + (multi_ - 1) * (labelWidth_+4) - 30;

			let row_ = (this.row || this.conf.row || 1);

			let readonly_ = false;
			if(this.readonly != undefined) {
				readonly_ = true;
			}

			return {
				label_,
				labelWidth_,
				labelAlign_,

				width_,
				row_,

				place_,

				minWidth: this.conf.minWidth || width_+29,

				readonly_,

				showSection: false,
			};
		},
		methods: {
			onBlur: function() {
				this.showSection = false;
			},
			onInput: function(event) {
				this.$emit('input', event.target.value);
			},
			onClear: function() {
				this.$emit('input', '');
			}
		},

		components: {
		},

		mounted: function() {
		},
	};
</script>

<style scoped>
	.compTxArea {
		display: inline-block;
		vertical-align: top;

		cursor: pointer;

		font-size: 0;
	}
	.compTxArea>* {
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

		overflow: hidden;
	}
	.box:hover {
		border: 1px solid gray;
	}
	.box.opened:hover {
		border: 1px solid lightgray;
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

		background: snow;

		font-size: 12px;
		color: #495051;

		height: inherit;
		line-height: inherit;
		padding: 0px;

		resize: none;
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