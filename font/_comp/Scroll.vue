<template>
	<div class="compFrameScroll" >
		<div class="inbox" ref="inb" @scroll="barRoll" :class="{ noVer: noVer_, noHor: noHor_ }">
			<slot />
		</div>
		<div class="bar ver" ref="barVer" @mousedown="barDownVer" @touchstart="barDownVer" />
		<div class="bar hor" ref="barHor" @mousedown="barDownHor" @touchstart="barDownHor" />
	</div>
</template>

<script>
	export default {
		props: {
			nover: {},
			nohor: {},
		},
		data: function() {
			let event = ('ontouchstart' in window) ? {
				down: 'touchstart',
				move: 'touchmove',
				up: 'touchend',
				over: 'touchstart',
				out: 'touchend'
			} : {
				down: 'mousedown',
				move: 'mousemove',
				up: 'mouseup',
				over: 'mouseover',
				out: 'mouseout'
			};

			let noVer_ = false;
			if(this.nover != undefined && (this.nover != 'false' || this.nover !== false)) { noVer_ = true; }

			let noHor_ = false;
			if(this.nohor != undefined && (this.nohor != 'false' || this.nohor !== false)) { noHor_ = true; }

			return {
				mobile: ('ontouchstart' in window),

				event: event,

				downVer: false,
				downHor: false,

				noVer_,
				noHor_
			};
		},
		methods: {
			barRoll: function() {
				let inb = this.$refs.inb;

				if(inb.scrollHeight > inb.clientHeight) {
					let barVer = this.$refs.barVer;

					barVer.style.top = (inb.scrollTop * inb.clientHeight / inb.scrollHeight) + 'px';
				}

				if(inb.scrollWidth > inb.clientWidth) {
					let barHor = this.$refs.barHor;

					barHor.style.left = (inb.scrollLeft * inb.clientWidth / inb.scrollWidth) + 'px';
				}
			},
			barDownVer: function() {
				let barVer = this.$refs.barVer;

				document.addEventListener(this.event.move, this.barMoveVer);
				document.addEventListener(this.event.up, this.barUponVer);

				document.body.className += ' nosel';
				barVer.style.backgroundColor = 'rgba(119, 119, 119, 0.7)';

				this.downVer = true;

				return false;
			},
			barDownHor: function() {
				let barHor = this.$refs.barHor;

				document.addEventListener(this.event.move, this.barMoveHor);
				document.addEventListener(this.event.up, this.barUponHor);

				document.body.className += ' nosel';
				barHor.style.backgroundColor = 'rgba(119, 119, 119, 0.7)';

				this.downHor = true;

				return false;
			},
			barUponVer: function() {
				let barVer = this.$refs.barVer;

				this.downVer = false;

				barVer.style.backgroundColor = '';
				document.body.className = document.body.className.replace(/ nosel/g, '');

				document.removeEventListener(this.event.move, this.barMoveVer);
				document.removeEventListener(this.event.up, this.barUponVer);

				return false;
			},
			barUponHor: function() {
				let barHor = this.$refs.barHor;

				this.downHor = false;

				barHor.style.backgroundColor = '';
				document.body.className = document.body.className.replace(/ nosel/g, '');

				document.removeEventListener(this.event.move, this.barMoveHor);
				document.removeEventListener(this.event.up, this.barUponHor);

				return false;
			},
			barMoveVer: function(e) {
				if(this.downVer) {
					let inb = this.$refs.inb;
					let barVer = this.$refs.barVer;

					if(inb.scrollHeight > inb.clientHeight) {
						let top = barVer.offsetTop + e.movementY;
						let max = inb.clientHeight - (inb.clientHeight * inb.clientHeight / inb.scrollHeight);

						if(top >= 0 && top <= max) {
							barVer.style.top = top + 'px';
							inb.scrollTop = (top * inb.scrollHeight / inb.clientHeight);
							// L(top * inb.scrollHeight / inb.clientHeight);
						}
					}
				}

				return false;
			},
			barMoveHor: function(e) {
				if(this.downHor) {
					let inb = this.$refs.inb;
					let barHor = this.$refs.barHor;

					if(inb.scrollWidth > inb.clientWidth) {
						let left = barHor.offsetLeft + e.movementX;
						let max = inb.clientWidth - (inb.clientWidth * inb.clientWidth / inb.scrollWidth);

						if(left >= 0 && left <= max) {
							barHor.style.left = left + 'px';
							inb.scrollLeft = (left * inb.scrollWidth / inb.clientWidth);
							// L(left * inb.scrollWidth / inb.clientWidth);
						}
					}
				}

				return false;
			},

			onUpdate: function() {
				let inb = this.$refs.inb;
				let barVer = this.$refs.barVer;
				let barHor = this.$refs.barHor;

				setTimeout(function() {
					if(!this.noVer_ && inb.scrollHeight > inb.clientHeight) {
						barVer.style.height = (inb.clientHeight * inb.clientHeight / inb.scrollHeight) + 'px';
						barVer.className += / show/.test(barVer.className) ? '' : ' show';
					}
					else {
						barVer.className = barVer.className.replace(/ show/g, '');
					}

					if(!this.noHor_ && inb.scrollWidth > inb.clientWidth) {
						barHor.style.width = (inb.clientWidth * inb.clientWidth / inb.scrollWidth) + 'px';
						barHor.className += / show/.test(barHor.className) ? '' : ' show';
					}
					else {
						barHor.className = barHor.className.replace(/ show/g, '');
					}
				}.bind(this), 401);
			}
		},

		mounted: function() {
			window.addEventListener('resize', this.onUpdate);
			this.onUpdate();
		},

		updated: function() {
			this.onUpdate();
		},

		destroyed: function() {
			window.removeEventListener('resize', this.onUpdate);
		}
	};
</script>

<style scoped>
	.compFrameScroll {
		overflow: hidden;
	}

	.inbox {
		position: relative;

		width: calc(100% + 17px);
		height: calc(100% + 17px);

		overflow: scroll;

		transition-property: none;
	}
	.inbox.noVer {
		width: 100%;
		overflow-y: hidden;
	}
	.inbox.noHor {
		height: 100%;
		overflow-x: hidden;
	}

	.bar {
		position: absolute;

		cursor: pointer;

		border-radius: 5px;
		background: transparent;

		transition-property: none;
	}
	.bar.ver {
		width: 10px;

		top: 0px;
		right: 0px;
	}
	.bar.hor {
		height: 10px;

		bottom: 0px;
		left: 0px;
	}
	.bar.show {
		background: rgba(119, 119, 119, 0.2);
	}
	.bar.show:hover {
		background: rgba(119, 119, 119, 0.7);
	}
</style>