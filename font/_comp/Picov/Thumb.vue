<template>
	<div class="compThumb" :class="border">
		<sPanel class="spanel inline" :title="title" :titlecolor="titleColor"
			@click.left.native="onSave"
			@click.right.prevent.native="onMenu"
		>
			<div
				class="img"
				:style="{ backgroundImage: 'url(api/thumb?iid='+illust.iid+'&time='+illust.time+'&type='+illust.type+')' }"
				:title="`IID：${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('; ')}`"
			>
			</div>
			<div class="stat left" v-html="B.dictIllust[illust.iid].statL"></div>
			<div class="stat right" v-html="B.dictIllust[illust.iid].statR"></div>
		</sPanel>
		<div class="menu inline" ref="menu" :class="{ left: !((index+1) % wrap) }" v-show="over" tabindex="45" @blur="over = false">
			<div class="button" @click="onAuthor">作者</div>
			<div class="button" @click="onUgoira" v-if="illust.type == 2">动图</div>
			<div class="button" @click="onRid">排除</div>
			<div class="button" @click="onSave" >下载</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			illust: { default: {} },
			index: { default: {} },
			wrap: { default: 5 }
		},
		data: function() {
			return {
				B: BUS,
				over: false
			};
		},

		methods: {
			onSave: function(event = {}, force = event.ctrlKey || false) {
				let { iid, count, type, time, stat } = this.illust;

				window.iii = this.illust;

				if(event.altKey) {
					this.onRid();
				}
				else {
					if(type == 2) {
						window.open(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${this.illust.iid}`);
					}

					if(!(stat.down || stat.ding) || force) {
						W.cast('api/save', { iid, count, type, time, force: force });
					}
				}
			},
			onMenu: function() {
				this.over = true;

				this.$nextTick(function() {
					this.$refs.menu.focus();
				}.bind(this));
			},
			onRid: function() {
				this.$set(this.illust.stat, 'rid', !this.illust.stat.rid);
			},
			onAuthor: async function() {
				BUS.changeAuthor(this.illust.uid, this.illust.user);
			},
			onUgoira: async function() {
				BUS.changeUgoira(this.illust);
			},
		},

		created: function() {
			this.illust.onSave = this.onSave;
		},
		watch: {
			illust: function(illust) {
				illust.onSave = this.onSave;
			}
		},

		computed: {
			title: function() {
				let illust = this.illust;

				if(illust.count > 1) {
					return `(${illust.count}) ${illust.title}`;
				}
				else {
					return illust.title;
				}
			},
			titleColor: function() {
				let illust = this.illust;

				if(illust.count > 1) {
					return 'darkgreen';
				}
				else if(illust.type == 2) {
					return 'blueviolet';
				}
				else {
					return 'gray';
				}
			},
			border: function() {
				let stat = this.illust.stat;

				if(stat.ding) {
					return 'ding';
				}
				else if(stat.rid) {
					return 'rid';
				}
				else if(stat.down) {
					return 'down';
				}
			}
		}
	};
</script>

<style scoped>
	.compThumb {
		position: relative;

		border: 2px solid #2e3235;
		border-radius: 4px;

		white-space: nowrap;
	}

	.spanel {
		position: relative;

		width: 100%;
		height: 100%;

		border-width: 0px;
	}

	.spanel>.img {
		width: 100%;
		height: calc(100% - 62px);

		margin-top: 10px;

		box-sizing: border-box;

		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
	}

	.spanel>.stat {
		position: absolute;

		bottom: 5px;

		color: lightgray;
		font-size: 12px;
	}
	.spanel>.stat.left {
		left: 10px;
	}
	.spanel>.stat.right {
		right: 10px;
	}

	.menu {
		position: absolute;
		top: -2px;

		width: 30px;
		height: 100%;

		border-radius: 0px 4px 4px 0px;
		border: 2px solid #0185e6;

		background: #0185e6;

		outline: none;
		z-index: 1;
	}
	.menu.left {
		left: -30px;

		border-radius: 4px 0px 0px 4px;
	}

	.menu>.button {
		width: 100%;
		height: 20px;

		margin-bottom: 4px;

		line-height: 20px;

		color: snow;
		font-size: 12px;
		text-align: center;
	}
	.menu>.button:hover {
		background: #0165af;
	}
</style>