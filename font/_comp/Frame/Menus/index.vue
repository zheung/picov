<template>
	<div class="compMenus nosel" ref="menu" v-show="C.show" @blur="onBlur" tabindex="999" :style="{ top: C.top+'px', left: C.left+'px' }">
		<Mitem :data="C.data" :top="true"></Mitem>
	</div>
</template>

<script>
	import Mitem from './menuItem';

	export default {
		components: { Mitem },
		data: function() {
			return X.init('menus', {
				show: false,

				top: 0,
				left: 0,

				data: []
			});
		},
		methods: {
			onBlur: function() {
				this.C.show = false;
			},
		},
		watch: {
			'C.show': function() {
				this.$nextTick(function() {
					this.$refs.menu.focus();
				}.bind(this));
			}
		}
	};
</script>

<style scoped>
	.compMenus {
		position: absolute;

		cursor: pointer;

		font-size: 0;

		background: #181e23;

		z-index: 999;

		top:300px;
		left: 800px;

		border-left: 2px solid lightgray;

		outline: none;
	}
</style>