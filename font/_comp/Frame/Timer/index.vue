<template>
	<div class="compTimer nosel transAll" >
		<div class="label nosel" @click="onShow"
			:style="{ width: labelWidth_? labelWidth_+'px' : false, 'text-align': labelAlign_ }"
		>
			{{ label_ ? label_+'：' : label_ }}</div>
		<div class="box" :style="{ width: width_+'px' }" :class="{ opened: showSection }" ref="box">
			<div @click="onShow" class="value">
				{{valueShow}}
			</div>
			<Fas @click="onShow" class="rightButton" :icon="['fas', 'calendar-alt']" />
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

			value: { default: function() { return moment().format('YYYY-MM-DD HH:mm:ss'); } },
			begin: {},
			end: {},

			onlydate: {}
		},
		data: function() {
			let label_ = this.label || this.conf.label || '';
			let labelWidth_ = this['label-width'] || this.conf.labelWidth || 0;
			let labelAlign_ = this['label-align'] || this.conf.labelAlign || 'left';

			let multi_ = this.multi || this.conf.multi || 1;
			let width_ = this.width || this.conf.width || 100;

			width_ = width_ * multi_ + (multi_ - 1) * (labelWidth_+4) - 30;

			let begin_ = this.begin || this.conf.begin || null;
			let end_ = this.end || this.conf.end || null;

			let onlyDate_ = false;
			if(this.onlydate != undefined && (this.onlydate != 'false' || this.onlydate !== false)) { onlyDate_ = true; }

			return {
				label_,
				labelWidth_,
				labelAlign_,

				width_,

				begin_,
				end_,

				minWidth: this.conf.minWidth || width_+29,

				showSection: false,

				onlyDate_,

				listConf: X.comp('timerBoxer'),
			};
		},
		methods: {
			onShow: function() {
				let listConf = this.listConf;

				listConf.parent = this.$refs.box;

				listConf.begin = this.begin_;
				listConf.end = this.end_;

				listConf.now = this.value;

				listConf.onSelect = this.onSelect;
				listConf.onBlur = this.onBlur;

				listConf.minWidth = this.minWidth_;

				listConf.onlyDate = this.onlyDate_;

				listConf.showSection = true;
				this.showSection = true;
			},
			onBlur: function() {
				this.showSection = false;
			},
			onSelect: function(time) {
				this.$emit('input', time);
			}
		},
		computed: {
			valueShow: function() {
				return this.onlyDate_ ? moment(this.value).format('YYYY-MM-DD') : this.value;
			}
		}
	};
</script>

<style scoped>
	.compTimer {
		display: inline-block;
		vertical-align: top;

		cursor: pointer;

		font-size: 0;
	}
	.compTimer>* {
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
		width: 100%;

		display: inline-block;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		height: inherit;
		line-height: inherit;
		padding: 0px;
	}

	.section {
		position: absolute;
		top: 20px;
		left: -1px;

		width: 189px;
		height: 260px;

		overflow: hidden;

		z-index: 100;

		border: 1px solid gray;
		background: #181e23;

		border-radius: 3px;

		padding: 10px;

		outline: none;

		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 0.7);
	}
</style>