<template>
	<div class="homeTopBox">
		<div class="title">
			<div class="big"><i class="pi pi-logo"></i>Picov</div>
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

		background: #181e23;

		box-shadow: 0px 1px 5px 0px rgba(65, 65, 65, 0.4);

		z-index: 4;
	}
	.title {
		position: absolute;

		width: calc(100% - 10px);
		height: 40px;

		line-height: 40px;

		top: 5px;
		left: 15px;

		color: gray;
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