<template>
	<div class="pic">
		<canvas class="piccan" ref= "can"></canvas>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				current: 0,
				timeout: 0,
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
			nextFrame: function() {

			},
			playFrame: function(nowPos = 0) {
				let nxtPos = nowPos+1;

				if(nowPos >= this.frames.length) {
					nowPos = 0;
					nxtPos = 1;
				}
				else if(nxtPos >= this.frames.length) {
					nxtPos = 0;
				}

				let now = this.frames[nowPos];
				let nxt = this.frames[nxtPos];

				this.loadPic(now.pic);

				this.timeout = setTimeout(function() {
					if(now.loaded) {
						this.playFrame(nowPos+1);
					}
					else {
						let wait = setInterval(function() {
							if(nxt.loaded) {
								clearInterval(wait);

								this.playFrame(nxtPos);
							}
						}.bind(this), 10);

					}
				}.bind(this), now.delay);
			},
			loadPic: function(pic) {
				let ctx = this.$refs.can.getContext('2d');
				ctx.canvas.width = pic.width;
				ctx.canvas.height = pic.height;

				ctx.clearRect(0, 0, pic.width, pic.height);
				ctx.drawImage(pic, 0, 0);
			},
			initPlayer: function() {
				for(let frame of this.frames) {
					let pic = frame.pic = new Image();

					pic.src = `tset/${frame.file}`;

					pic.onload = function() {
						frame.loaded = true;
					};

					if(this.frames[0] === frame) {
						pic.onload = function() {
							L('initPlay');
							this.playFrame();
						}.bind(this);
					}
				}
			}
		}
	};
</script>

<style scoped>
	.piccan {
		max-width: 200px;
	}
</style>