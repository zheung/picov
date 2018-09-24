<template>
	<div class="compTimerBoxer nosel transAll" ref="section" tabindex="999" v-show="C.showSection"
		@focus="onFocusBoxer" @blur="onBlurBoxer"
		:style="{ 'min-width': C.minWidth+'px', top: typeof C.top == 'number' ? C.top+'px': false, left: typeof C.left == 'number' ? C.left+'px': false }"
	>
		<Caler @input="onSelect" :time="C.now" :begin="C.begin" :end="C.end" :focus="onFocusInput" :blur="onBlurInput" :onlydate="C.onlyDate"></Caler>
	</div>
</template>

<script>
	import Caler from './timerCaler';

	export default {
		components: { Caler },
		data: function() {
			return X.init('timerBoxer', {
				top: 0,
				left: 0,

				begin: null,
				end: null,

				parent: null,

				now: moment().format('YYYY-MM-DD 00:00:00'),

				minWidth: 99,

				showSection: false,

				onSelect: null,
				onBlur: null,

				onlyDate: false
			}, {}, {
				focusBoxer: false,
				focusInput: false,

				time: ''
			});
		},
		watch: {
			'C.showSection': function(now) {
				if(now) {
					this.time = this.C.now;

					this.$nextTick(function() {
						this.$refs.section.focus();
					}.bind(this));
				}
			},
			'C.parent': function(now) {
				if(now) {
					let { top, left } = this.calcPos(now);

					this.C.top = top;
					this.C.left = left;
				}
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
			onBlur: function() {
				this.C.showSection = false;
			},
			onSelect: function(time) {
				this.time = time;

				let funcSelect = this.C.onSelect;

				if(typeof funcSelect == 'function') {
					funcSelect(this.time);
				}
			},

			onFocusBoxer: function() {
				this.focusBoxer = true;
			},
			onBlurBoxer: function() {
				this.focusBoxer = false;

				this.onBlurAll();
			},
			onFocusInput: function() {
				this.focusInput = true;
			},
			onBlurInput: function() {
				this.focusInput = false;

				this.onBlurAll();
			},
			onBlurAll: function() {
				this.$nextTick(function() {
					if(!this.focusBoxer && !this.focusInput) {
						this.C.showSection = false;

						let funcBlur = this.C.onBlur;

						if(typeof funcBlur == 'function') {
							funcBlur();
						}

						// let funcSelect = this.C.onSelect;

						// if(typeof funcSelect == 'function') {
						// 	funcSelect(this.time);
						// }
					}
				}.bind(this));
			}
		}
	};
</script>

<style scoped>
	.compTimerBoxer {
		position: absolute;

		width: 189px;
		height: 280px;

		overflow: hidden;

		z-index: 100;

		border: 1px solid gray;
		background: #181e23;

		border-radius: 3px;

		padding: 10px;

		outline: none;

		font-size: 12px;

		cursor: pointer;

		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 0.7);
	}
</style>