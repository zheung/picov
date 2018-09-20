<template>
	<sPanel class="compThumb" :title="illust.title" :class="{ down: illust.down, ding: illust.ding }"
		:titlecolor="(illust.multi ? 'darkgreen' : (illust.ugoira ? 'blueviolet' : '#0285e6'))"
	>
		<div
			class="img"
			:style="{ backgroundImage: 'url(uapi/thumb?iid='+illust.iid+'&time='+illust.time+'&ugoira='+illust.ugoira+')' }"
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

		border-width: 4px;
	}

	.compThumb>.img {
		width: calc(100% - 20px);
		height: calc(100% - 30px);

		margin: 10px;

		box-sizing: border-box;

		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
	}

	.compThumb>.stat {
		position: absolute;

		bottom: 0px;

		height: 22px;

		color: #0185e6;
		font-size: 12px;
	}
	.compThumb>.stat.left {
		left: 10px;
	}
	.compThumb>.stat.right {
		right: 10px;
	}
</style>