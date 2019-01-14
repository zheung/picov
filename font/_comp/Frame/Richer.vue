<template>
	<div class="compTxArea nosel transAll">
		<div class="label nosel" v-if="label_"
			:style="{ width: labelWidth_? labelWidth_+'px' : false, 'text-align': labelAlign_ }"
		>
			{{ label_ ? label_+'：' : label_ }}
		</div>
		<div class="box" :style="{ width: width_+'px', height: (row*20+(row_-1)*20)+'px', borderColor: readonly_ ? 'transparent' : 'lightgray' }">
			<quill-editor type="text" class="value" :readonly="readonly_" :style="{ height: (row*20+(row_-1)*20)+'px' }"
				@change="onInput" :content="value" :placeholder="place_"
				:options="quillOption"
			>
			</quill-editor>
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

			place: {},

			option: {}
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

			let quillOption = {
				modules: {
					toolbar: {
						container: [
							[{ 'size': ['small', false, 'large', 'huge'] }],
							['bold', 'italic', 'underline', 'strike'],
							[{ 'color': [] }, { 'background': [] }],
							[{ 'align': [] }, 'blockquote'],
							[{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
							['link', 'image'],

							['clean']
						],
						handlers: {
							'image': function() {
								Quill.QuillWatch.emit(this.quill.id);
							}
						}
					},
					ImageExtend: {
						loading: true,
						name: 'file',
						action: 'api/platUpload',
						response: function(res) {
							return res.data[0];
						}
					},
				},
				placeholder: '',
				theme: 'snow'
			};

			return {
				label_,
				labelWidth_,
				labelAlign_,

				width_,
				row_,

				place_,

				minWidth: this.conf.minWidth || width_+29,

				readonly_,

				quillOption,
			};
		},
		methods: {
			onInput: function(event) {
				this.$emit('input', event.html);
			},
			onClear: function() {
				this.$emit('input', '');
			}
		},

		watch: {
			'value': function(now) {
				L(now);
			}
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

		border: 1px solid gray;
		width: auto;

		height: 20px;
		line-height: 20px;
		border-radius: 4px;

		padding-left: 10px;
		padding-right: 20px;

		cursor: auto;
	}
	.box:hover {
		border: 1px solid gray;
	}
	.box.opened:hover {
		border: 1px solid gray;
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

		background: #181e23;

		font-size: 12px;

		line-height: inherit;
		padding: 0px;

		resize: none;
	}
	dxxp .value .ql-formats {
		margin-right: 0px;
	}
	dxxp .value>.ql-toolbar {
		position: relative;

		border: none;
		border-bottom: 1px solid lightgray;
		z-index: 2;
	}
	dxxp .value>.ql-container {
		position: relative;
		border: none;

		z-index: 1;

		height: calc(100% - 41px);
	}
</style>