<template>
	<div class="compThumb" :class="border" @mouseover="over = true" @mouseout="over = false">
		<!-- <div class="bar" style="fontWeight:bold">{{title}}</div> -->
		<div
			class="img"
			:style="{ backgroundImage: 'url(uapi/picov/image/thumb?square=true&iid='+illust.iid+'&time='+illust.time+'&type='+illust.type+')' }"
			:title="`IID：${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('; ')}`"
		>
			<div class="info" :class="{ _show: over }">
				{{title}}
			</div>
		</div>
		<!-- <div class="bar">
			<Fa class="inline icon" icon="home" />
			<Fa class="inline icon" icon="search" />
		</div> -->
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
		data() {
			return {
				over: false
			};
		},

		computed: {
			title() {
				let illust = this.illust;

				if(illust.count > 1) {
					return `(${illust.count}) ${illust.title}`;
				}
				else {
					return illust.title;
				}
			},
			titleColor() {
				let illust = this.illust;

				if(illust.count > 1) {
					return 'darkgreen';
				}
				else if(illust.type == 2) {
					return 'blueviolet';
				}
				else {
					return '';
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
			showDetail() {

			},
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

	border-style: solid
	border-width: 0px

	cursor: pointer

	white-space: nowrap

	transition: border-width 0.4s ease 0s

	&:hover
		border-color: green
		border-width: 4px
		border-radius: 14px

	>.img
		position: relative
		height: calc(100% - 0 * (24px + 10px))

		box-sizing: border-box

		background-repeat: no-repeat
		background-size: cover
		background-position: center center

		>.info
			position: absolute
			width: 100%
			height: 100%
			opacity: 0
			transition: opacity 0.4s ease 0s


			&._show
				opacity: 1
				background: linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 24%, rgba(255,255,255,0) 76%, rgba(0,0,0,0.4) 100%)

	>.bar
		box-sizing: border-box
		padding: 0px 5px
		margin: 5px 0px

		width: 100%
		height: 24px

		font-size: 14px
		line-height: 24px

		>.icon
			margin-right: 5px
			height: 100%
</style>