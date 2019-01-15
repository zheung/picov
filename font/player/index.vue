<template>
	<div class="pic">
		<canvas class="piccan" @click="pp" ref= "can"></canvas>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				current: 0,
				timeout: 0,
				loaded: 0,
				frames: [
					{ file: '000000.jpg', delay: 50 }, { file: '000001.jpg', delay : 50 },
					{ file: '000002.jpg', delay: 50 }, { file: '000003.jpg', delay : 50 },
					{ file: '000004.jpg', delay: 50 }, { file: '000005.jpg', delay : 50 },
					{ file: '000006.jpg', delay: 50 }, { file: '000007.jpg', delay : 50 },
					{ file: '000008.jpg', delay: 50 }, { file: '000009.jpg', delay : 50 },
					{ file: '000010.jpg', delay: 50 }, { file: '000011.jpg', delay : 50 },
					{ file: '000012.jpg', delay: 50 }, { file: '000013.jpg', delay : 50 },
					{ file: '000014.jpg', delay: 50 }, { file: '000015.jpg', delay : 50 },
					{ file: '000016.jpg', delay: 50 }, { file: '000017.jpg', delay : 50 },
					{ file: '000018.jpg', delay: 50 }, { file: '000019.jpg', delay : 50 },
					{ file: '000020.jpg', delay: 50 }, { file: '000021.jpg', delay : 50 },
					{ file: '000022.jpg', delay: 50 }, { file: '000023.jpg', delay : 50 },
					{ file: '000024.jpg', delay: 50 }, { file: '000025.jpg', delay : 50 },
					{ file: '000026.jpg', delay: 50 }, { file: '000027.jpg', delay : 50 },
					{ file: '000028.jpg', delay: 50 }, { file: '000029.jpg', delay : 50 },
					{ file: '000030.jpg', delay: 50 }, { file: '000031.jpg', delay : 50 },
					{ file: '000032.jpg', delay: 50 }, { file: '000033.jpg', delay : 50 },
					{ file: '000034.jpg', delay: 50 }, { file: '000035.jpg', delay : 50 },
					{ file: '000036.jpg', delay: 50 }, { file: '000037.jpg', delay : 50 },
					{ file: '000038.jpg', delay: 50 }, { file: '000039.jpg', delay : 50 }
				]
			};
		},

		created: function() {
		},
		mounted: async function() {
			this.initPlayer();
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
							let wait = setInterval(function() {
								if(now.next.loaded) {
									clearInterval(wait);

									this.playFrame(now.next.index);
								}
							}.bind(this), 10);
						}
					}.bind(this), now.delay);
				}


			},
			loadPic: function(pic) {
				let ctx = this.$refs.can.getContext('2d');

				ctx.canvas.width = pic.width;
				ctx.canvas.height = pic.height;

				ctx.clearRect(0, 0, pic.width, pic.height);
				ctx.drawImage(pic, 0, 0);
			},
			initPlayer: function() {
				let frames = this.frames;
				let prev = frames[frames.length - 1];
				let index = 0;

				for(let frame of frames) {
					prev.next = frame;
					prev = frame;

					frame.index = index++;

					let pic = frame.pic = new Image();

					pic.src = `tset/${frame.file}`;

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

		top: 20px;

		max-width: 400px;
	}
</style>