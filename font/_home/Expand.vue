<template>
	<div :class="{ homeLeftExpand: true, trans: true, hide: !expand }" @click="ctrlExpand()">
		<Fas class="icon" :icon="expand?'angle-double- left':'angle-double- right'" />
	</div>
</template>

<script>
	export default {
		props: [ 'ctrlExpand', 'expand' ],

		data: function() {
			return {
				now: '',
			};
		},
		watch: {
			keyDefault: function(keyDefault) {
				this.click(keyDefault);
			}
		},
		methods: {
			click: function(key) {
				let tab = this.tabs[key];

				this.now = key;

				if(this.dealer && tab) {
					this.dealer(key);
				}
			}
		}
	};
</script>

<style scoped>
	.homeLeftExpand {
		display: inline-block;

		width: 10px;
		height: 100%;

		position: absolute;
		top: 0px;
		left: 0px;

		background: #657179;

		color: snow;

		cursor: pointer;

		transition: all 0.2s;

		vertical-align: top;

		z-index: 1;
	}
	.homeLeftExpand.hide {
		background: #0185e6;
	}

	.icon {
		position: relative;
		top: 50%;
		font-size: 1em;
	}
</style>