<template>
	<div class="compMenusItem">
		<div class="name inline" @mouseover="onMouseover" @mouseout="onMouseout" v-if="name" :style="{ align: align || 'center' }" @click="onClick">
			{{name}}
			<Fas class="caret" icon="caret-right" v-if="list.length"/>
		</div>
		<div class="subs inline" @mouseover="onMouseover" @mouseout="onMouseout" v-show="top || show">
			<menuItem v-for="item of list" :key="`item-${(Math.random()+'').slice(-8)}-${item.name}`" :data="item" />
		</div>
	</div>
</template>

<script>
	import Mitem from './menuItem';

	export default {
		components: { Mitem },
		name: 'menuItem',
		props: {
			data: {},
			top: {},
		},
		data: function() {
			let data = this.data;

			let list = [];

			if(data && typeof data == 'object') {
				if(data instanceof Array) {
					list = data;
				}
				else if(data.list && typeof data.list == 'object' && data.list instanceof Array && data.list.length) {
					list = data.list;
				}
			}

			return {
				list,
				name: data.name || null,
				align: data.align || 'center',

				show: false,
				showDelay: false,
			};
		},
		watch: {
			data: function(data) {
				let list = [];

				if(data && typeof data == 'object') {
					if(data instanceof Array) {
						list = data;
					}
					else if(data.list && typeof data.list == 'object' && data.list instanceof Array && data.list.length) {
						list = data.list;
					}
				}

				this.list = list;
				this.name = data.name || null;
				this.align = data.align || 'center';
			}
		},
		methods: {
			onClick: function() {
				try {
					let data = this.data;
					let handler = data.handler;

					if(handler) {
						handler(data.data || data);
					}
				}
				finally {
					X.comp('menus').show = false;
				}
			},
			onMouseover: function() {
				this.show = true;
				this.showDelay = false;
			},
			onMouseout: function() {
				if(!this.showDelay) {
					this.showDelay = true;

					setTimeout(function() {
						if(this.showDelay) {
							this.show = false;
						}
					}.bind(this), 20);
				}
			},
			calcPos: function(target) {
				let pos = { top: target.offsetTop + 21, left: target.offsetLeft };

				target = target.offsetParent;

				while(target) {
					pos.top += target.offsetTop;
					pos.left += target.offsetLeft;

					target = target.offsetParent;
				}

				return pos;
			},
			onBlur: function() {
				this.C.showSection = false;
			},
			onSelect: function(item) {
				let func = this.C.onSelect;

				if(typeof func == 'function') {
					func(item);
				}

				this.C.showSection = false;
			}
		},

		mounted: function() {
		},
	};
</script>

<style scoped>
	.compMenusItem {
		white-space: nowrap;
	}
	.name {
		position: relative;

		padding: 10px;

		width: 100%;
		height: 10px;

		background: #181e23;

		font-size: 12px;
		line-height: 10px;
		white-space: nowrap;
	}
	.name:hover {
		background-image: linear-gradient(-173deg, #e2e2e2 8%, #eaeaea 85%);
	}
	.subs {
		position: absolute;
		box-shadow: 24px 2px 7px -2px rgba(128, 128, 128, 0.7);
	}
	.subs>.compMenusItem>.name {
		border-left: 3px solid lightgray;
	}
	.subs>.compMenusItem>.name:hover {
		border-left: 3px solid #0285e6;
	}
	.subs>.compMenusItem:first-child>.name {
		border-top: 1px solid #0285e6;
		border-top-right-radius: 3px;
	}
	.subs>.compMenusItem:last-child>.name {
		border-bottom-right-radius: 3px;
	}
	.caret {
		float: right;
	}
</style>