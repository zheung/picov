<template>
	<div class="compCombo nosel transAll" >
		<div class="label nosel" @click="onShow"
			:style="{ width: labelWidth_? labelWidth_+'px' : false, 'text-align': labelAlign_ }"
		>
			{{ label_ ? label_+'：' : label_ }}
		</div>
		<div class="box" :style="{ width: width_+'px' }" :class="{ opened: showSection, inva: invalid }" ref="box">
			<div @click="onShow" class="value">
				{{now_[textField_]}}
			</div>
			<Fas @click="onShow" class="rightButton" :icon="['fas', 'chevron-down']" />
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

			list: {},

			multi: {},
			width: {},

			regexp: {},

			value: {},

			before: {},
			after: {},

			textfield: {},
			valuefield: {},

			filter: {},

			boxheight: {},
		},
		data: function() {
			let label_ = this.label || this.conf.label || '';
			let labelWidth_ = this['label-width'] || this.conf.labelWidth || 0;
			let labelAlign_ = this['label-align'] || this.conf.labelAlign || 'left';

			let multi_ = this.multi || this.conf.multi || 1;
			let width_ = this.width || this.conf.width || 100;

			let boxHeight_ = this.boxheight || this.conf.boxheight || 300;

			width_ = width_ * multi_ + (multi_ - 1) * (labelWidth_+4) - 30;

			let list_ = this.list || this.conf.list || [];
			let before_ = this.before || this.conf.before || [];
			let after_ = this.after || this.conf.after || [];

			let textField_ = this.textfield || this.conf.textfield || 'name';
			let valueField_ = this.valuefield || this.conf.valuefield || 'code';
			let now_ = before_[0] || list_[0] || { text: '' };

			let filter_ = false;
			if(this.filter != undefined && (this.filter != 'false' || this.filter !== false)) { filter_ = true; }

			if(this.value || this.value === 0) {
				for(let item of list_) {
					if(item[valueField_] == this.value) {
						now_ = item;

						break;
					}
				}
			}

			return {
				label_,
				labelWidth_,
				labelAlign_,

				width_,

				list_,
				before_,
				after_,

				textField_,
				valueField_,
				now_,

				boxHeight_,

				minWidth_: this.conf.minWidth || ~~width_+29,

				showSection: false,

				listConf: X.comp('comboBoxer'),

				invalid: false,

				filter_
			};
		},
		watch: {
			list: function(list) {
				this.list_ = list;

				for(let item of list) {
					if(item[this.valueField_] == this.now_.value) {
						this.onSelect(item, false);

						return;
					}
				}

				this.onSelect(this.before_[0] || list[0] || { text: '' }, false);
			},
			now_: function(now) {
				if(this.regexp instanceof RegExp) {
					this.invalid = !this.regexp.test(now[this.valueField_]);
				}
			},
			value: function(value) {
				if((value || value === 0) && this.now_[this.valueField_] != value) {
					let now;
					for(let item of this.list_) {
						if(item[this.valueField_] == this.value) {
							now = item;

							break;
						}
					}

					if(now) {
						this.onSelect(now, false);
					}
				}
			}
		},
		methods: {
			onShow: function() {
				let listConf = this.listConf;

				listConf.parent = this.$refs.box;

				listConf.list = this.list_;
				listConf.before = this.before_;
				listConf.after = this.after_;

				listConf.onSelect = this.onSelect;

				listConf.width = this.width_;

				listConf.now = this.now_;

				listConf.showSection = true;
				this.showSection = true;

				listConf.filter = this.filter_;

				listConf.boxHeight = this.boxHeight_;
			},
			onSelect: function(item, isEmit = true) {
				this.now_ = item;

				if(isEmit) {
					this.$emit('input', item[this.valueField_], item[this.textField_]);
				}

				this.showSection = false;
			}
		},

		components: {
		},

		mounted: function() {
		},
	};
</script>

<style scoped>
	.compCombo {
		display: inline-block;
		vertical-align: top;

		cursor: pointer;

		font-size: 0;
	}
	.compCombo>* {
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
		border: 1px solid gray;
	}
	.box.opened:hover {
		border: 1px solid lightgray;
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