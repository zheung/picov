<template>
	<div class="pic">
		<canvas class="piccan" @click="pp" ref= "can" :style="{ left: `calc(50% - ${width/2}px)`, top: `calc(50% - ${height/2}px)` }"></canvas>
	</div>
</template>

<script>
	export default {
		data: function() {
			return X.init(this.$options._componentTag, {
				dict: {}
			}, {
				tab: {},

				illust: {}
			}, {
				width: 0,
				height: 0,

				current: 0,

				timeout: 0,
				interval: 0,

				loaded: 0,
				frames: []
			});
		},

		created: function() {
			A.reg('api/infoUgoira', 'api/infoUgoira');
		},

		watch: {
			'S.illust': async function(now) {
				this.initPlayer(now);
			}
		},

		methods: {
			pp: function() {
				if(this.timeout) {
					clearTimeout(this.timeout);

					this.timeout = 0;
				}
				else {
					this.playFrame(this.current);
				}
			},
			nextFrame: function(frame) {
				this.current = frame.index;

				if(frame.pic) {
					this.loadPic(frame.pic);
				}

				this.timeout = setTimeout(frame.loaded, frame.delay);
			},
			playFrame: function(nowPos = 0) {
				if(nowPos >= this.frames.length) {
					nowPos = 0;
				}

				let now = this.frames[nowPos];

				if(this.loaded >= this.frames.length) {
					clearTimeout(this.timeout);

					this.nextFrame(now);
				}
				else {
					this.current = nowPos;

					this.loadPic(now.pic);

					this.timeout = setTimeout(function() {
						if(now.loaded) {
							this.playFrame(nowPos+1);
						}
						else {
							this.interval = setInterval(function() {
								if(now.next.loaded) {
									clearInterval(this.interval);

									this.playFrame(now.next.index);
								}
							}.bind(this), 10);
						}
					}.bind(this), now.delay);
				}
			},
			loadPic: function(pic) {
				let ctx = this.$refs.can.getContext('2d');

				this.width = ctx.canvas.width = pic.width;
				this.height = ctx.canvas.height = pic.height;

				ctx.clearRect(0, 0, pic.width, pic.height);
				ctx.drawImage(pic, 0, 0);
			},
			initPlayer: function(illust) {
				clearInterval(this.timeout);
				clearInterval(this.interval);
				this.loader = 0;
				this.current = 0;
				let frames = this.frames = illust.frames;

				let iid = illust.iid;

				let prev = frames[frames.length - 1];
				let index = 0;

				for(let frame of frames) {
					prev.next = frame;
					prev = frame;

					frame.index = index++;

					let pic = frame.pic = new Image();

					pic.src = `large/${iid}/${frame.file}`;

					pic.addEventListener('load', function() {
						this.loaded++;

						frame.loaded = function() {
							this.nextFrame(frame.next);
						}.bind(this);
					}.bind(this));

					if(frames[0] === frame) {
						pic.addEventListener('load', function() {
							L('first');
							this.playFrame();
						}.bind(this));
					}
				}
			}
		}
	};
</script>

<style scoped>
	.piccan {
		position: relative;

		max-width: 100%;
		max-height: 100%;
	}
</style>