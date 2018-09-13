<template>
	<div class="homeLogin nosel trans d7" :class="`step${C.step}`">
		<div class="backBox trans d7" :class="`step${C.step}`"></div>
		<div class="loginBox trans d7" :class="`step${C.step}`">
			<div class="title" style="font-family: KaiTi !important;"><i class="pi pi-logo"></i>广州普勒仕运营平台</div>
			<Fas class="logo1" :icon="['fas', 'user']" />
			<Fas class="logo1 logo2" :icon="['fas', 'key']" />
			<input type="text" class="line trans value" v-model="C.name" placeholder="用户名" tabindex="1" @keyup.enter="onLogin" />
			<br>
			<input type="password" class="line trans value" v-model="C.pass" placeholder="密码" tabindex="2" @keyup.enter="onLogin" />
			<br>
			<div class="line trans button" @click="onLogin" tabindex="3">登录</div>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return X.init(this.$options._componentTag,
				{
					name: '',
					pass: '',
					step: 0
				}
			);
		},

		methods: {
			onLogin: async function() {
				let { C } = this;

				if(!C.name.trim() || !C.pass.trim()) { return; }

				try {
					await A.post('login', { name: C.name, password: C.pass });

					try {
						let init = await A.conn('init');

						BUS.module = init.module || {};
						BUS.device = init.device || {};

						BUS.homeType = init.homeType || '';

						C.step = 1;
						setTimeout(function() {
							C.step = 2;
						}, 1001);
						setTimeout(function() {
							C.step = 3;

							BUS.user = init.user || {};
						}, 2001);
					}
					catch (error) { true; }


				}
				catch(error) {
					X.alert(error);
				}

			},

		},

		mounted: async function() {
			A.reg('login', 'uapi/login');
		}
	};
</script>

<style scoped>
	.homeLogin {
		position: fixed;

		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;

		background: transparent;

		z-index: 4;
	}
	.backBox {
		position: fixed;

		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;

		background-image: linear-gradient(270deg, #1faaf1 45%, #0185e6 85%);

		background: url(back.jpg) no-repeat center center;
		background-size: 100% auto;

		filter: blur(7px);
		transform: scale(1.2);
	}

.loginBox {
		position: fixed;

		top: calc(50% - 115px);
		left: calc(50% - 200px);

		width: 400px;
		height: 200px;

		background: rgba(250, 250, 250, 0.7);

		box-shadow: 0px 3px 7px 1px rgba(0, 0, 0, 0.7);

		border-radius: 7px;

		padding-top: 30px;
	}

	.line {
		display: block;

		margin-top: 10px;

		font-size: 12px;

		width: 350px;
		height: 30px;
		line-height: 30px;

		border-radius: 7px;

		margin-left: 25px;
	}

	.value {
		width: 320px;

		border: 1px solid #1faaf1;
		outline: none;

		background: snow;

		font-size: 12px;
		color: #495051;

		padding: 0px;
		padding-left: 30px;
	}

	.value::-webkit-input-placeholder {
		color: lightgray;
	}

	.button {
		display: inline-block;

		height: 34px;
		line-height: 34px;

		border: 1px solid transparent;
		border-radius: 4px;

		background: #1faaf1;

		color: snow;

		overflow: hidden;
		text-align: center;
		cursor: pointer;

		font-size: 12px;
	}
	.button.white {
		background: snow;

		color: #1faaf1;
	}
	.button:hover {
		box-shadow: 1px 1px 4px -1px #3d94d4;
		border: 1px solid #3d94d4;
	}

	.title {
		position: absolute;

		top: -56px;
		left: 0px;
		right: 0px;

		font-size: 34px;
		font-weight: bold;

		color: snow;

		text-align: center;
	}

	.logo1 {
		position: absolute;
		top: 49px;
		left: 34px;

		color: #495051;
		font-size: 14px;

		z-index: 1;
	}
	.logo2 {
		top: 107px;
	}

	.homeLogin.step3 {
		display: none;
	}
	.backBox.step1, .backBox.step2 {
		filter: blur(0px);
		transform: scale(1);
	}
	.backBox.step2 {
		opacity: 0;
	}
	.loginBox.step1, .loginBox.step2, .loginBox.step3 {
		opacity: 0;
	}
	.loginBox.step2, .loginBox.step3 {
		display: none;
	}

</style>