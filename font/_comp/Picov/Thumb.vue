<template>
	<sPanel class="compThumb" :title="title" :class="border"
		:titlecolor="titleColor"
	>
		<div
			class="img"
			:style="{ backgroundImage: 'url(api/thumb?iid='+illust.iid+'&time='+illust.time+'&type='+illust.type+')' }"
			:title="`IID：${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('；')}`"
		>
		</div>
		<div class="stat left" v-html="illust.statL"></div>
		<div class="stat right" v-html="illust.statR"></div>
	</sPanel>
</template>

<script>
	export default {
		props: {
			illust: { default: {} }
		},
		data: function() {
			return {};
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
				let illust = this.illust;

				if(illust.ding) {
					return 'ding';
				}
				else if(illust.rid) {
					return 'rid';
				}
				else if(illust.down) {
					return 'down';
				}
			}
		}
	};
</script>

<style scoped>
	.compThumb {
		position: relative;
	}

	.compThumb>.img {
		width: 100%;
		height: calc(100% - 62px);

		margin-top: 10px;

		box-sizing: border-box;

		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
	}

	.compThumb>.stat {
		position: absolute;

		bottom: 5px;

		color: lightgray;
		font-size: 12px;
	}
	.compThumb>.stat.left {
		left: 10px;
	}
	.compThumb>.stat.right {
		right: 10px;
	}
</style>