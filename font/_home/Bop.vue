<template>
	<div class="homeBop trans nosel" >
		<div class="item"><Fas icon="user" /> {{B.user.nick}}</div>
		<div class="item"><Fas icon="bell" /> 消息</div>
		<div class="item" @click="onLogout"><Fas icon="sign-out-alt"/> 注销</div>
	</div>
</template>

<script>
	export default {
		components: {
		},
		data: function() {
			return X.init(this.$options._componentTag);
		},
		methods: {
			noticeOver: function() {
				this.$refs.popAbout.style.visibility = 'visible';
				this.$refs.popAbout.style.opacity = 1;
			},
			noticeOutt: function() {
				this.$refs.popAbout.style.visibility = 'hidden';
				this.$refs.popAbout.style.opacity = 0;
			},
			onLogout: async function() {
				A.reg('logout', 'uapi/logout');
				await A.post('logout');

				location.reload();
			}
		},
		mounted: function() {
			// setTimeout(function() {
			// 	this.noticeOutt();
			// }.bind(this), 3400);
		}
	};
</script>

<style scoped>
	.homeBop {
		position: fixed;

		bottom: 0px;
		right: 0px;

		height: 25px;
		line-height: 25px;

		border-radius: 5px 0px 0px 0px;

		font-size: 0;
		text-align: center;

		cursor: pointer;

		z-index: 2;
	}

	.homeBop.hidding {
		opacity: 0;
	}
	.homeBop.hidding:hover {
		opacity: 100;
	}

	.homeBop>span {
		color: gray;
		background: #57b7d8;
	}

	.homeBop>.item:first-child {
		border-radius: 5px 0px 0px 0px;
	}

	.item {
		display: inline-block;

		padding: 0px 5px 0px 5px;

		color: gray;
		background: #1faaf1;

		font-size: 14px;
	}
	.item:hover {
		background: #0185e6;

		box-shadow: 0px 0px 5px 0px rgba(67, 122, 146, 0.5);
	}

	.popAbout {
		width: 450px;

		position: absolute;

		bottom: 25px;
		right: 66px;

		background: #2da1c9;

		border-top: 5px solid #148474;
		border-radius: 7px 7px 0px 7px;

		padding: 4px;

		font-size: 15px;
		line-height: 30px;

		text-align: left;

		box-shadow: -2px 2px 5px 0px rgba(67, 122, 146, 0.5);
	}
</style>