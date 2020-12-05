<template>
	<div class="compThumb" :class="border">
		<div class="bar" style="fontWeight:bold">{{title}}</div>
		<div
			class="img"
			:style="{ backgroundImage: 'url(uapi/picov/image/thumb?square=true&iid='+illust.iid+'&time='+illust.time+'&type='+illust.type+')' }"
			:title="`IID：${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('; ')}`"
		/>
		<div class="bar">
			<Fa class="inline icon" icon="home" />
			<Fa class="inline icon" icon="search" />
		</div>
		<!-- <div v-show="over" ref="menu" class="menu inline" :class="{ left: !((index+1) % wrap) }" tabindex="45" @blur="over = false">
			<div class="button" @click="onAuthor">作者</div>
			<div class="button" @click="onViewer">{{illust.type == 2 ? '动图' : '原图'}}</div>
			<div class="button" @click="onRid">排除</div>
			<div class="button" @click="onOpen">原链</div>
			<div class="button" @click="onOpenAuthor">作链</div>
		</div> -->
	</div>
</template>

<script>
	export default {
		props: {
			illust: { type: Object, default() { return {}; } },
			index: { type: Number, default: 0 },
			// wrap: { default: 5 }
		},
		data: function() {
			return {
				over: false
			};
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
				// let stat = this.illust.stat;

				// if(stat.ding) {
				// 	return 'ding';
				// }
				// else if(stat.rid) {
				// 	return 'rid';
				// }
				// else if(stat.down) {
				// 	return 'down';
				// }

				return false;
			}
		},
		watch: {
			illust: function(illust) {
				illust.onSave = this.onSave;
			}
		},

		created: function() {
			// this.illust.onSave = this.onSave;
		},

		methods: {
			onSave: function(event = {}, force = event.ctrlKey || false) {
				let { iid, count, type, time, stat } = this.illust;

				window.iii = this.illust;

				if(event.altKey) {
					this.onRid();
				}
				else {
					// if(type == 2) {
					// 	window.open(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${this.illust.iid}`);
					// }

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
				B.changeAuthor(this.illust.uid, this.illust.user);
			},
			onViewer: async function() {
				B.changeViewer(this.illust);
			},
			onOpen: async function() {
				window.open(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${this.illust.iid}`);
			},
			onOpenAuthor: async function() {
				window.open(`https://www.pixiv.net/member_illust.php?id=${this.illust.uid}&type=illust`);
			}
		},
	};
</script>

<style lang="sass" scoped>
.compThumb
	position: relative
	box-sizing: border-box
	overflow: hidden

	margin-top: 20px

	cursor: pointer

	white-space: nowrap


	&:hover
		border-color: green


	>.img
		width: 75%
		padding: 75% 0px 0px 100%

		box-sizing: border-box

		background-repeat: no-repeat
		background-size: contain
		background-position: center center

	>.bar
		box-sizing: border-box
		padding: 0px 5px
		margin: 5px 0px

		width: 100%
		height: 24px

		font-size: 14px
		line-height: 24px

		>.icon
			height: 100%
			margin-right: 5px
</style>