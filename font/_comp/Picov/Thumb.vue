<template>
	<sPanel class="compThumb" :title="illust.title" :class="{ down: illust.down, ding: illust.ding }"
		:titlecolor="(illust.multi ? 'darkgreen' : (illust.ugoira ? 'blueviolet' : 'gray'))"
	>
		<div
			class="img"
			:style="{ backgroundImage: 'url(api/thumb?iid='+illust.iid+'&time='+illust.time+'&ugoira='+illust.ugoira+')' }"
			:title="`IID：${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('；')}`"
		>
		</div>
		<div class="stat left">
			{{illust.stat1}}
		</div>
		<div class="stat right">
			{{illust.stat2}}
		</div>
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

		methods: {
		}
	};
</script>

<style scoped>
	.compThumb {
		position: relative;
	}

	.compThumb>.img {
		width: 100%;
		height: calc(100% - 40px);

		margin-top: 10px;

		box-sizing: border-box;

		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
	}

	.compThumb>.stat {
		position: absolute;

		bottom: 0px;

		height: 22px;

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