<template>
	<div class="compWindow" v-if="C.show" @keyup.capture.esc="onClose" tabindex="123" ref="window"
		:style="{ top: C.top+'px', left: C.left+'px' }"
	>
		<div class="head nosel"
			:style="{ cursor: C.moving ? 'move' : 'default' }"
			@mousemove="onMouseMove" @mousedown="onMoveStart" @mouseup="onMoveEnd" @mouseout="onMoveEnd"
		>
			<div class="title">{{C.title}}</div>
			<Fas @click="onClose" class="closeButton" :icon="['fas', 'times']" />
		</div>
		<component :is="C.comp" :conf="C.conf"
		></component>
	</div>
</template>

<script>
	export default {
		props: {
		},
		data: function() {
			return X.init('win', {
				moving: false,
				top: 0,
				left: 0,

				show: false,
				comp: '',
				title: '',

				width: 500,
				height: 500,

				conf: {}
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

					if(this.C.conf.mask) {
						this.$set(X.comp('Masker'), 'mask', ~~this.C.conf.mask);
					}
				}
				else {
					this.$set(X.comp('Masker'), 'mask', 0);
				}
			}
		},
		methods: {
			onClose: function() {
				X.wins.hide();
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
	.compWindow {
		position: fixed;

		padding: 4px;

		border-radius: 4px;

		min-width: 100px;
		min-height: 100px;

		box-shadow: 0px 3px 7px 1px rgba(64, 64, 64, 0.7);

		background-image: linear-gradient(-90deg, #0185e6 45%, #1faaf1 85%);

		overflow: hidden;

		outline: 0;

		z-index: 4;
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
	}
	.head>.closeButton {
		height: 22px;

		float: right;

		cursor: pointer;
	}
</style>