<template>
	<div class="homeLeft nosel" :class="{ hide: !expand }" @mouseover="C.mouseOver = true" @mouseout="C.mouseOver = false">
		<div class="homeLeftBox">
			<div class="topButton trans func" :class="{ hover: C.listShow=='module' }" @click="C.listShow='module'">
				<Fas icon="home" /> 功能
			</div>
			<div class="topButton trans station" :class="{ hover: C.listShow=='device' }" @click="C.listShow='device'">
				<Fas icon="map-marker-alt" /> 收藏
			</div>
			<div class="hrline"></div>
			<Scroll class="naviList trans" :style="{ left: (C.listShow=='module'? 10: -270)+'px'}">
				<li class="listItem" :class="{ opened: C.expandTop.module == listIndex }"
					v-for="(sub1, listIndex) of B.module" :key="'naviSub-module-'+listIndex" v-if="sub1.show"
				>
					<div class="top1 trans" :class="{ opened: C.expandTop.module == listIndex }"
						:title="sub1.name" @click="expandSub('module', listIndex)"
					>
						<div class="top1Name">
							 {{sub1.name}}
						</div>
						<Fas :icon="C.expandTop.module == listIndex ? 'caret-up' : 'caret-down'" class="expand" />
					</div>
					<div v-for="sub2 of sub1.list" :key="'naviSub-module'+sub2.name"
						:title="sub2.name"
						class="top2 trans"
						:class="{ show: C.expandTop.module == listIndex }"
						v-if="sub2.show"
						@click="B.changeTab(sub2)"
					>
						● {{sub2.name}}
					</div>
				</li>
			</Scroll>

			<div class="findBox trans" :style="{ left: (C.listShow=='device'? 0: 270)+'px'}">
				<Texter v-model="keyword" place="" width="250" @focus="onKeywordFocus" @blur="onKeywordBlur"></Texter>
			</div>

			<Scroll class="naviList device trans" :style="{ left: (C.listShow=='device'? 10: 280)+'px'}">
				<li class="listItem" :class="{ opened: C.expandTop.device == project.id }"
					v-for="project of projList" :key="'naviSub-device-'+project.id" v-if="project.show"
				>
					<div class="top1 trans" :class="{ opened: C.expandTop.device == project.id }"
						:title="project.name" @click="expandSub('device', project.id)"
						:projid="project.id"
					>
						<div class="top1Name">
							{{project.name}}
						</div>
						<Fas :icon="C.expandTop.device == project.id ? 'caret-up' : 'caret-down'" class="expand" />
					</div>
					<div v-for="device of project.list" :key="'naviSub-device-'+device.id"
						:title="`${device.name} [${device.id}]`"
						:devid="device.id"
						class="top2 trans"
						:class="{ show: C.expandTop.device == project.id, hightlight: keynow == device.id }"
						v-if="device.show"
						@click="B.changeDevice(device)"
						@contextmenu.prevent="onContext(device, project, $event)"
					>
						<Fas icon="desktop" /> {{device.name}}
					</div>
				</li>
			</Scroll>
		</div>

		<div :class="{ homeLeftSide: true, work: expand, trans:true }" @click="ctrlExpand()"
			:title="expand ? '展开侧栏' : '关闭侧栏'"
		>
			<Fas class="iconOpen" :icon="expand ? 'angle-left' : 'angle-right'" />
		</div>
	</div>
</template>

<script>
	import Expand from './Expand';
	import { debounce } from 'lodash';

	export default {
		components: { Expand },

		data: function() {
			let expandTop = {
				module: 1,
				device: 1
			};

			let proj = BUS.device[0];

			if(proj) {
				expandTop.device = proj.id;
			}

			return X.init(this.$options._componentTag,
				{
					listShow: 'module',

					expandTop,

					overUser: false,

					ctrlExpand: this.ctrlExpand,

					pinned: false,
					expandFocus: false,

					keywordFocus: false,
					mouseOver: false
				},
				{},
				{
					keyword: '',
					keynow: -1,

					projList: BUS.device,

					debcKeyword: {
						dirty: false,
						calc: false
					},

					tmplList: [],
				}
			);
		},

		watch: {
			keyword: function() {
				this.debcKeyword.dirty = true;
				this.debcKeywordFunc();
			},
			'C.pinned': function(now) {
				if(now) {
					this.C.expandFocus = true;
				}
				else {
					this.C.expandFocus = false;
				}
			}
		},

		computed: {
			expand: function() {
				if(this.C.pinned) {
					return this.C.expandFocus;
				}
				else {
					return this.C.mouseOver || this.C.keywordFocus;
				}
			}
		},


		methods: {
			onKeywordFocus: function() {
				this.C.keywordFocus = true;
			},
			onKeywordBlur: function() {
				this.C.keywordFocus = false;
			},
			onContext: function(device, project, event) {
				let output = [];
				for(let tmpl of this.tmplList) {
					output.push({
						name: tmpl.title,
						align: 'left',

						list: [{
							name: '一键导出',

							data: {
								tmplID: tmpl.id,
								project: project,
								device: device,
							},
							handler: this.onPicMake
						}, {
							name: '修改内容',

							data: {
								tmplID: tmpl.id,
								project: project,
								device: device,
							},
							handler: this.onPicModify
						}]
					});
				}

				X.menu([{
					name: '图片导出',
					list: output
				}], event);
			},
			onPicMake: async function(data) {
				A.jump('docPicoutMake', {
					tmpl: data.tmplID,
					project: data.project.id,
					device: data.device.id
				});
			},
			onPicModify: async function(data) {
				await this.B.changeTab(this.B.findTab('docpicout'));

				this.$nextTick(function() {
					let comp = X.comp('docPicout');

					comp.tmplID = data.tmplID;
					comp.project = data.project;
					comp.device = data.device;
				});
			},

			expandSub: function(listKey, listIndex) {
				this.$set(this.C.expandTop, listKey, listIndex);
			},

			ctrlExpand: function(val) {
				let { C } = this;

				if(!C.pinned) { return; }

				C.expandFocus = val != undefined ? val : !C.expandFocus;
			},
			onLogout: async function() {
				A.reg('logout', 'uapi/logout');
				await A.post('logout');

				location.reload();
			},

			debcKeywordFunc: debounce(function () {
				this.debcKeyword.calc = true;

				let projDict = {};

				// let projs = [];
				// let devs = [];

				for(let proj of this.B.device) {
					for(let dev of proj.list) {
						if(dev.name.indexOf(this.keyword)+1 || (/^\d+$/.test(this.keyword) && dev.id == ~~this.keyword )) {
							let projNew = projDict[proj.id] || (projDict[proj.id] = {
								id: proj.id,
								name: proj.name,
								show: proj.show,
								status: proj.status,
								list: []
							});

							projNew.list.push(dev);
						}
					}
				}

				this.projList = Object.values(projDict);

				if(this.projList.length) {
					this.C.expandTop.device = this.projList[0].id;
				}

				this.debcKeyword.calc = false;
				this.debcKeyword.dirty = false;

			}, 500)
		},

		created: async function() {
			A.reg('docPicoutList', 'uapi/docPicoutList');
			A.reg('docPicoutMake', 'uapi/docPicoutMake');
		},

		mounted: async function() {
			let { B } = this;

			this.$nextTick(async function() {
				let homeType = BUS.homeType;

				let hash = window.location.hash.replace(/^#/, '');

				await B.changeTab(B.findTab(homeType));

				if(hash && hash != homeType && hash != 'docpicout') {
					await B.changeTab(B.findTab(hash));
				}
			});
		}
	};
</script>

<style scoped>
	.homeLeft {
		position: fixed;

		top: 50px;
		left: 0px;
		bottom: 0px;

		width: 280px;

		color: #495051;

		box-shadow: -1px 0px 4px #0185e6;

		z-index: 2;
	}
	.homeLeft.hide {
		left: -270px;
	}

	.homeLeftBox {
		display: inline-block;

		position: absolute;

		top: 0px;
		left: 0px;

		width: 270px;
		height: 100%;

		background: snow;

		overflow: hidden;
	}

	.homeLeftSide {
		display: block;

		position: absolute;

		background: snow;

		top: 0px;
		bottom: 0px;
		right: 0px;

		width: 10px;

		font-size: 11px;

		cursor: pointer;

		z-index: -1;
	}
	.homeLeftSide:hover {
		background: #e9f4ff;
	}

	.topButton {
		position: absolute;

		display: block;

		text-align: center;

		cursor: pointer;

		border: 2px solid transparent;
	}
	.topButton:hover {
		color: #0185e6;
		background: #e9f4ff;
	}
	.topButton.hover {
		color: #0185e6;
	}

	.hrline {
		position: absolute;

		display: block;

		text-align: center;

		background: transparent;

		height: 1px;

		top: 38px;

		left: 10px;
		right: 10px;

		border-bottom: 1px solid #0185e6;
	}
	.hrline.bottom {
		top: unset;
		bottom: 34px;
	}


	.topButton.user {
		width: 120px;
		height: 30px;

		bottom: 0px;
		left: 0px;

		font-size: 14px;

		line-height: 30px;
	}
	.topButton.notice {
		width: 100px;
		height: 30px;

		bottom: 0px;
		left: 125px;

		font-size: 14px;

		line-height: 30px;
	}
	.topButton.expander {
		width: 30px;
		height: 30px;

		bottom: 0px;
		right: 0px;

		line-height: 30px;
	}
	.topButton.menu {
		width: 122px;

		left: -2px;
		bottom: 32px;

		border: 0px;

		border-radius: 0px 4px 0px 0px;

		overflow: hidden;

		line-height: 30px;

		text-align: left;

		background: snow;

		box-shadow: 0px 0px 9px 0px #777777;
	}
	.menuInfo:hover {
		color: #0185e6;
	}
	.topButton.menu>div {
		padding-left: 10px;
	}
	.topButton.menu>div:hover {
		background-image: linear-gradient(-173deg, #e2e2e2 8%, #eaeaea 85%);
	}

	.topButton.func {
		width: 131px;
		height: 36px;

		top: 0px;
		left: 0px;

		line-height: 36px;
	}
	.topButton.station {
		width: 131px;
		height: 36px;

		top: 0px;
		left: 135px;

		line-height: 36px;
	}

	.naviList {
		font-size: 13px;

		height: calc(100% - 90px);
		overflow-x: hidden;
		overflow-y: hidden;

		position: absolute;

		top: 50px;
		width: 250px;
	}

	.top1 {
		padding-left: 20px;
		padding-right: 10px;

		height: 30px;
		line-height: 30px;

		overflow: hidden;

		cursor: pointer;
	}
	.top1.opened {
		/* background-image: linear-gradient(-173deg, #e2e2e2 8%, #eaeaea 85%); */
		background: #0185e6;
		color: snow;
	}
	.top1:not(.opened):hover {
		color: #0185e6;
	}
	/* .top1:hover::before, .top1.opened::before {
		content: ' ';

		position: absolute;

		top: 0px;
		left: 0px;

		width: 4px;
		height: 100%;

		background: #0185e6;
	} */

	.top2 {
		padding-left: 35px;
		padding-right: 10px;

		height: 0px;
		line-height: 30px;

		overflow: hidden;

		cursor: pointer;
	}
	.top2:hover {
		background-image: linear-gradient(-90deg, #84d5ff 30%, #e4f6ff 85%);
	}
	.top2.show {
		height: 30px;
		border-width: 0px;
	}

	.top1Name {
		display: inline-block;

		width: calc(100% - 20px);

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.expand {
		float: right;

		padding-top: 8px;

		font-size: 16px;

		cursor: pointer;
	}

	.naviList.device {
		top: 80px;
		height: calc(100% - 120px);

		border-top: 1px solid #eaeaea;
	}
	.findBox {
		position: relative;
		top: 40px;

		padding: 10px 10px 0px 10px;
	}
	.hightlight {
		color: #0185e6;
	}

	.iconOpen {
		height: 100%;

		font-size: 14px;
		color: #0185e6;
	}

	.listItem {
		overflow: hidden;

		border-top: 1px solid #eaeaea;
	}
	.listItem.opened {
		border: 1px solid #0185e6;
		border-radius: 3px;
	}
</style>