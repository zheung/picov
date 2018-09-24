<template>
	<div class="compTexter nosel transAll">
		<div class="label nosel" v-if="label_"
			:style="{ width: labelWidth_? labelWidth_+'px' : false, 'text-align': labelAlign_ }"
		>
			{{ label_ ? label_+'：' : label_ }}
		</div>
		<div class="box" :style="{ width: width_+'px', height: (row_*20+(row_-1)*20)+'px' }" @click="onFilect" :class="{ inva: invalid }">
			<div class="value">
				<div style="display: inline-block; padding-right:10px" v-for="file of files" :key="'files'+file.name">
					<Fas icon="file" /> {{file.name}}
				</div>
			</div>

			<input ref="filect" class="file" type="file" :accept="accept_" :multiple="multiple_" @change="onChange"/>
		</div>
		<div class="rightButton count" v-show="files.length && row_ > 1">
			{{files.length}}
			<Fas :style="{ fontSize: '13px', cursor: 'pointer' }" icon="times-circle" @click="onClear" />
		</div>
		<div class="rightButton" @click="onFilect"><Fas icon="file-upload" /> 选择文件</div>
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

			place: {},

			notnull: {},
			multiple: {},
			accept: '',
		},
		data: function() {
			let label_ = this.label || this.conf.label || '';
			let labelWidth_ = this['label-width'] || this.conf.labelWidth || 0;
			let labelAlign_ = this['label-align'] || this.conf.labelAlign || 'left';

			let multi_ = this.multi || this.conf.multi || 1;
			let row_ = (this.row || this.conf.row || 1);

			let width_ = this.width || this.conf.width || 100;
			width_ = width_ * multi_ + (multi_ - 1) * (labelWidth_+4) - 70;

			let place_ = this.place || this.conf.place || '';

			let multiple_ = false;
			if(this.multiple != undefined && (this.multiple != 'false' || this.multiple !== false)) { multiple_ = true; }

			let notnull_ = false;
			if(this.notnull != undefined && (this.notnull != 'false' || this.notnull !== false)) { notnull_ = true; }

			let accept_ = this.accept||'image/png,image/gif,image/jpeg';

			return {
				label_,
				labelWidth_,
				labelAlign_,

				width_,

				place_,

				names: '',
				count: 0,

				files: [],

				multiple_,
				notnull_,
				row_,

				minWidth: this.conf.minWidth || width_+29,

				showSection: false,

				invalid: false,

				accept_: accept_
			};
		},
		methods: {
			onChange: function(event) {
				this.$emit('input', this.files = event.target.files);

				this.invalid = this.files.length == 0 && this.notnull_;
			},
			onFilect: function() {
				this.$refs.filect.click();

			},
			onClear: function() {
				this.$emit('input', this.files = []);

				this.invalid = this.notnull_;
			},
		},

	};
</script>

<style scoped>
	.compTexter {
		display: inline-block;
		vertical-align: top;

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

		border: 1px solid gray;
		width: auto;
		line-height: 20px;
		border-radius: 4px;

		padding-left: 10px;
		padding-right: 60px;

		cursor: pointer;
	}
	.box:hover {
		border: 1px solid gray;
	}
	.box.inva {
		border-color: orangered;
	}

	.rightButton {
		position: absolute;

		bottom: 1px;
		right: 0px;

		width: 70px;
		height: 20px;

		padding: 0px 4px;

		color: gray;

		line-height: 20px;
		text-align: right;

		cursor: pointer;
	}
	.rightButton:hover, .rightButton.hover {
		color: inherit;
	}
	.rightButton.count {
		bottom: 20px;

		cursor: inherit;
	}

	.value {
		display: inline-block;

		width: 100%;

		border: 0;
		outline: none;

		background: transparent;

		font-size: 12px;

		height: inherit;
		line-height: inherit;
		padding: 0px;

		white-space: normal ;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.file {
		display: none;
	}

	.section {
		position: absolute;
		top: 20px;
		left: -1px;
		z-index: 100;
		border: 1px solid gray;
		background: #181e23;
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