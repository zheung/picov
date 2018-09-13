<template>
	<div class="compComboBoxer nosel transAll" ref="section" tabindex="999" v-show="C.showSection"
		@focus="onFocusBoxer" @blur="onBlurBoxer"
		:style="{ width: (C.width+30)+'px', top: typeof C.top == 'number' ? C.top+'px': false, left: typeof C.left == 'number' ? C.left+'px': false }"
	>
		<Texter class="texter" ref="texter" width="200" v-model="C.keyword" @focus="onFocusInput" @blur="onBlurInput" v-if="C.filter"></Texter>
		<div class="hrline" v-if="C.filter"></div>
		<Scroll class="box" :style="{ height: (listLength < C.boxHeight ? listLength : C.boxHeight)+'px' }">
			<div v-for="(item, iid) of before" :key="`combo-before-${iid}`"
				@click="onSelect(item)"
				:class="{ item: true, selected: C.now == item }"
			>
				{{item[C.textField]}}
			</div>
			<div v-for="(item, iid) of list" :key="`combo-${iid}`"
				@click="onSelect(item)"
				:class="{ item: true, selected: C.now == item }"
			>
				{{item[C.textField]}}
			</div>
			<div v-for="(item, iid) of after" :key="`combo-after-${iid}`"
				@click="onSelect(item)"
				:class="{ item: true, selected: C.now == item }"
			>
				{{item[C.textField]}}
			</div>
		</Scroll>
	</div>
</template>

<script>
	import Texter from './Texter';

	import { debounce } from 'lodash';

	export default {
		components: { Texter },

		data: function() {
			return X.init('comboBoxer', {
				top: 0,
				left: 0,

				list : [],
				before: [],
				after : [],

				textField: 'name',
				valueField: 'code',
				now: { text: '' },

				width: 99,

				showSection: false,

				parent: null,

				onSelect: null,

				filter: false,

				keyword: ''
			}, {}, {
				focusBoxer: false,
				focusInput: false,

				debcKeyword: {
					dirty: false,
					calc: false
				},

				list : [],
				before: [],
				after : [],
			});
		},
		watch: {
			'C.showSection': function(now) {
				if(now) {
					this.$nextTick(function() {
						if(this.C.filter) {
							this.$refs.texter.$refs.input.focus();
						}
						else {
							this.$refs.section.focus();
						}
					}.bind(this));
				}
			},
			'C.parent': function(now) {
				if(now) {
					let { top, left } = this.calcPos(now);

					this.C.top = top;
					this.C.left = left;
				}
			},
			'C.keyword': function() {
				this.debcKeyword.dirty = true;
				this.debcKeywordFunc();
			},
			'C.list': function(list) {
				this.list = list;

				this.C.keyword = '';
			},
			'C.before': function(list) {
				this.before = list;

				this.C.keyword = '';
			},
			'C.after': function(list) {
				this.after = list;

				this.C.keyword = '';
			}
		},
		methods: {
			calcPos: function(target) {
				let pos = { top: target.offsetTop + 21, left: target.offsetLeft };

				target = target.offsetParent;

				while(target) {
					pos.top += target.offsetTop;
					pos.left += target.offsetLeft;

					target = target.offsetParent;
				}

				return pos;
			},
			onFocusBoxer: function() {
				this.focusBoxer = true;
			},
			onBlurBoxer: function() {
				this.focusBoxer = false;

				this.$nextTick(function() {
					if(!this.focusBoxer && !this.focusInput) {
						this.C.showSection = false;
					}
				});
			},
			onFocusInput: function() {
				this.focusInput = true;
			},
			onBlurInput: function() {
				this.focusInput = false;

				this.$nextTick(function() {
					if(!this.focusBoxer && !this.focusInput) {
						this.C.showSection = false;
					}
				});
			},
			onSelect: function(item) {
				let func = this.C.onSelect;

				if(typeof func == 'function') {
					func(item);
				}

				this.C.showSection = false;
			},

			debcKeywordFunc: debounce(function () {
				this.debcKeyword.calc = true;

				let keyword = this.C.keyword;

				for(let listType of ['list', 'before', 'after']) {
					if(keyword) {
						this[listType] = [];
					}
					else {
						this[listType] = this.C[listType];
						continue;
					}

					for(let item of this.C[listType]) {
						let code = item[this.C.valueField];
						let name = item[this.C.textField];

						if(
							code == keyword ||
							name == keyword ||
							(typeof code == 'string' && code.indexOf(keyword)+1) ||
							(typeof name == 'string' && name.indexOf(keyword)+1)
						) {
							this[listType].push(item);
						}
					}
				}

				this.debcKeyword.calc = false;
				this.debcKeyword.dirty = false;
			}, 500)
		},
		computed: {
			listLength: function() {
				let C = this.C;

				return ((C.before ? C.before.length : 0) + (C.list ? C.list.length : 0) + (C.after ? C.after.length : 0)) * 24;
			},
		},
	};
</script>

<style scoped>
	.compComboBoxer {
		position: absolute;

		padding-top: 10px;
		padding-bottom: 10px;

		z-index: 100;

		border: 1px solid lightgray;
		border-radius: 3px;
		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 0.7);

		background: snow;

		overflow: hidden;

		font-size: 12px;

		outline: none;

		cursor: pointer;
	}

	.compComboBoxer>.texter {
		padding-bottom: 10px;

		cursor: default;
	}
	.compComboBoxer>.hrline {
		width: 70%;

		margin-left: 15%;

		padding-bottom: 10px;

		border-top: 1px solid #0285e6;

		cursor: default;
	}

	.compComboBoxer>.box {
		position: relative;
		max-height: 300px;
	}
	.compComboBoxer .item {
		height: 24px;
		line-height: 24px;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		padding-left: 10px;
		padding-right: 10px;
	}
	.compComboBoxer .item.selected {
		color: #1faaf1;
	}
	.compComboBoxer .item:hover {
		background: #f1f1f1;
		color: #1faaf1;
	}
</style>