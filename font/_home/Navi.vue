<template>
	<div class="naviBox nosel">
		<div :class="{ navi: true, mini: X.comp('homeLeft') && X.comp('homeLeft').pinned && X.comp('homeLeft').expandFocus, trans: true }">
			<!-- <div class="leftDot" >
				<Fas icon="ellipsis-v" />
			</div> -->
			<div ref="tabBox" class="tabBox trans" :style="{ 'left': C.left+'px' }">
				<div v-for="view of C.views" :key="'view'+view.type"
					:class="{ trans: true, tab: true, hover: B.viewNow==view.type }"
					@click="B.changeTab(view)"
				>
					{{view.name}}
					<Fas v-if="view.base != B.homeType" class="icon trans" :icon="['far', 'times-circle']"
						@click.stop="B.closeTab(view)"
					/>
				</div>
			</div>
			<div class="tabCtrlBox" :style="{ 'left': '11px' }">
				<div class="trans naviButton one" @mousedown="scrollKeep(1, 40, true)" @mouseup="scrollKeep(1, 40, false)">
					<Fas class="icon" icon="angle-left" />
				</div>
				<div class="trans naviButton two" @mousedown="scrollKeep(2, -40, true)" @mouseup="scrollKeep(2, -40, false)">
					<Fas class="icon" icon="angle-right" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return X.init(this.$options._componentTag,
				{
					left: 0,

					views: [],
					tabNow: {}
				},
				{},
				{
					iid: []
				}
			);
		},
		mounted() {
			document.addEventListener('keydown', event => {
				if(event.keyCode == 112) {
					event.preventDefault();

					let views = this.C.views;

					if(views.length == 1) { return; }

					let index = views.indexOf(this.C.tabNow);

					if(index == -1) {
						return;
					}
					else if(index == 0) {
						index = views.length - 1;
					}
					else {
						index--;
					}

					BUS.changeTab(views[index]);
				}
				else if(event.keyCode == 113) {
					event.preventDefault();

					let views = this.C.views;

					if(views.length == 1) { return; }

					let index = views.indexOf(this.C.tabNow);

					if(index == -1) {
						return;
					}
					else if(index == views.length - 1) {
						index = 0;
					}
					else {
						index++;
					}

					BUS.changeTab(views[index]);
				}
			}, false);
		},

		methods: {
			scroll: function(val = 0) {
				let { C } = this;

				let widthShow = this.$refs.tabBox.clientWidth - 60;
				let width = 0;
				let left = C.left;

				for(let child of this.$refs.tabBox.children) {
					width += child.clientWidth;
				}

				let min = 0 - (width - widthShow);

				if(width > widthShow) {
					if(val > 0) {
						C.left = left + val > 0 ? 0 : left + val;
					}
					else {
						C.left = left + val < min ? min : left + val;
					}
				}
			},
			scrollKeep: function(id, val = 0, keep = false) {
				if(!keep) {
					clearInterval(this.iid[id]);
				}
				else {
					this.scroll(val);

					this.iid[id] = setInterval(function() {
						this.scroll(val);
					}.bind(this), 100);
				}
			}
		},


	};
</script>

<style scoped>
	.naviBox {
		position: fixed;

		top: 0px;
		left: 0px;
		right: 0px;

		height: 39px;

		box-shadow: 0 -1px 4px #414141;

		z-index: 1;
	}
	.naviBox>.navi {
		position: absolute;

		top: 0px;
		left: 20px;
		right: 10px;

		overflow: hidden;

		z-index: 1;
	}
	.naviBox>.navi.mini {
		left: 293px;
	}
	.tabBox {
		position: relative;

		white-space: nowrap;
	}
	.tab {
		display: inline-block;

		height: 37px;

		padding: 0px 16px 0px 16px;

		border-bottom: 2px solid transparent;

		line-height: 39px;

		font-size: 13px;

		cursor: pointer;
	}
	.tab.hover {
		color: lightgray;
	}
	.tab:hover {
		height: 37px;

		border-bottom: 2px solid lightgray;

		color: lightgray;
	}
	.tab::after {
		content: ' ';

		position: absolute;

		top: 10px;
		right: 0px;

		height: 20px;

		border-left: 1px solid gray;
	}
	.tab:first-child::before {
		content: ' ';

		position: absolute;

		top: 10px;
		left: 0px;

		height: 20px;

		border-left: 1px solid gray;
	}
	.tab>.icon {
		position: absolute;

		right: 0px;

		font-size: 16px;

		color: #0185e6;

		opacity: 0;
	}
	.tab:hover>.icon {
		opacity: 100;
	}

	.naviButton {
		position: absolute;
		top: 0px;

		width: 30px;
		height: 37px;

		border-bottom: 2px solid transparent;

		line-height: 39px;

		cursor: pointer;
	}
	.naviButton:hover {
		border-bottom: 2px solid lightgray;

		color: lightgray;
	}
	.naviButton.one {
		right: 30px;
	}
	.naviButton.two {
		right: 0px;
	}
	.naviButton>.icon {
		position: relative;

		left: 11px;
	}
</style>