<template>
	<div class="compAlert" v-if="C.show" @keyup.capture.esc="onClose(false)" tabindex="123" ref="window"
		:style="{ top: C.top+'px', left: C.left+'px' }"
	>
		<div class="head nosel"
			:style="{ cursor: C.moving ? 'move' : 'default' }"
			@mousemove="onMouseMove" @mousedown="onMoveStart" @mouseup="onMoveEnd" @mouseout="onMoveEnd"
		>
			<div class="title">{{C.title || '提示'}}</div>
			<Fas @click="onClose(false)" class="closeButton" :icon="['fas', 'times']" />
		</div>
		<div class="box">
			<div class="line">
				{{C.text}}
			</div>
			<div class="line">
				<div class="button nosel white right trans" @click="onClose(C.btnValue2 || false)" v-if="C.mode == 'quest'">{{ C.btnText2 || '取消'}}</div>
				<div class="button nosel white right trans" @click="onClose(C.btnValue1 || true)" >{{ C.btnText1 || '确定'}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
		},
		data: function() {
			return X.init('alert', {
				moving: false,
				top: 0,
				left: 0,

				text: '',

				title: null,

				btnText1: null,
				btnText2: null,
				btnValue1: null,
				btnValue2: null,

				show: false,

				waiter: null,

				mode: 'alert',

				mask: {}
			});
		},
		watch: {
			'C.show': function(now) {
				if(now) {
					this.$nextTick(function() {
						let win = this.$refs.window;

						win.focus();

						this.C.top = (window.innerHeight - win.clientHeight) / 2;
						this.C.left = (window.innerWidth - win.clientWidth) / 2;
					}.bind(this));

					if(this.C.mask) {
						this.$set(X.comp('Masker'), 'mask', 5);
					}
				}
				else {
					this.$set(X.comp('Masker'), 'mask', 0);
				}
			}
		},
		methods: {
			onClose: function(val) {
				let C = this.C;

				C.title = null;
				C.mode = 'alert';
				C.btnText1 = null;
				C.btnText2 = null;
				C.btnValue1 = null;
				C.btnValue2 = null;

				C.show = false;
				this.$set(X.comp('Masker'), 'mask', 0);

				if(typeof C.waiter == 'function') {
					C.waiter(val);

					C.waiter = null;
				}
			},
			onMouseMove: function(e) {
				if(e.buttons == 1) {
					this.C.top += e.movementY;
					this.C.left += e.movementX;
				}
			},
			onMoveStart: function() {
				this.C.moving = true;
			},
			onMoveEnd: function() {
				this.C.moving = false;
			}
		}
	};
</script>

<style scoped>
	.compAlert {
		position: fixed;

		padding: 4px;

		border-radius: 4px;

		min-width: 100px;
		min-height: 100px;

		box-shadow: 0px 3px 7px 1px rgba(64, 64, 64, 0.7);

		background-image: linear-gradient(-173deg, #0185e6 45%, #1faaf1 85%);

		overflow: hidden;

		outline: 0;

		color: #495051;

		z-index: 5;
	}
	.head {
		height: 25px;

		padding: 0px 5px 0px 5px;

		background: transparent;

		color: snow;
	}
	.head>* {
		display: inline-block;

		vertical-align: top;
	}
	.head>.title {
		height: 22px;

		font-size: 12px;
		font-weight: bold;
		line-height: 22px;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.head>.closeButton {
		height: 22px;

		float: right;

		cursor: pointer;
	}

	.box {
		font-size: 12px;

		min-width: 100px;

		padding: 0px 10px 0px 10px;

		color: snow
	}

	.line {
		display: inline-block;
		vertical-align: top;

		width: 100%;

		margin-top: 10px;
		margin-bottom: 10px;

		font-size: 12px;
	}

	.button {
		display: inline-block;
		border: 1px solid transparent;
		border-radius: 4px;

		background: #1faaf1;

		color: snow;
		width: 60px;
		height: 24px;

		overflow: hidden;
		text-align: center;
		line-height: 24px;
		cursor: pointer;

		font-size: 12px;
	}
	.button.white {
		background: snow;

		color: #1faaf1;
	}
	.button.right {
		float: right;

		margin-left: 5px;
	}
	.button:hover {
		box-shadow: 1px 1px 4px -1px #3d94d4;
		border: 1px solid #3d94d4;
	}
</style>