<template>
	<div class="homeTopBox">
		<div class="title">
			<div class="big"><i class="pi pi-logo"></i>广州普勒仕运营平台</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {
		},

		props: [ 'currentview', 'changetab' ],

		data: function() {
			return {
				tabs: {
					calendar: { title: '日历测试' },
					iconMaker: { title: '头像生成' }
				}
			};
		}
	};
</script>

<style scoped>
	.homeTopBox {
		position: fixed;

		top: 0px;
		left: 0px;
		right: 0px;

		height: 50px;

		color: #242424;

		background-image: linear-gradient(-173deg, #1faaf1 45%, #0185e6 85%);

		box-shadow: 0px 1px 5px 0px rgba(20, 116, 158, 0.5);

		z-index: 4;
	}
	.title {
		position: absolute;

		width: calc(100% - 10px);
		height: 40px;

		line-height: 40px;

		top: 5px;
		left: 15px;

		color: snow;
	}
	.title>.big {
		display: inline-block;

		font-size: 24px;
		font-weight: bold;
		height: 40px;
		line-height: 40px;

		vertical-align: top;
	}
	.title>.big>img {
		height: 24px;
	}
</style>