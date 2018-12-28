<template>
	<div class="compProcmProduct">
		<sTopbar class="topbar">
			<Texter class="onLeft" v-model="query.key" label="搜索" width="200" @keyup.enter.native="onSearch"></Texter>
			<Combo class="onLeft" v-model="query.r18" :list="B.data.r18" width="60"></Combo>
			<sButton class="onLeft" text="全部下载" @click="onSaveAll"></sButton>
			<sButton class="onLeft" text="全部强制下载" @click="onSaveAll(true)"></sButton>

			<pPager class="onRight" v-model="query.page"
				@keyup.enter.native="onQuery(query.page)" :onoffset="onQuery"
			></pPager>
		</sTopbar>

		<div class="thumbBox">
			<pThumb class="thumb inline" v-for="(illust, illustIndex) of data" :key="`thumb-${illustIndex}`" :illust="illust" @click.native="onSave(illust)" @click.ctrl.native="onSave(illust, true)"></pThumb>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				data: [],

				// 和分页、筛选有关的可变的值
				query: {
					page: 1,

					key: '',

					r18: 0
				},

				B: BUS
			};
		},

		created: function() {
			A.reg('listFollow', 'api/listFollow');
			A.reg('save', 'api/save');
		},
		mounted: async function() {
			this.onQuery();
		},

		methods: {
			onSearch: async function() {
				BUS.changeSearch(this.query);
			},
			onQuery: async function(page) {
				if(~~page) {
					this.query.page = ~~page;
				}
				else {
					this.query.page = 1;
				}

				let result = await A.conn('listFollow', this.query);

				this.$set(this, 'data', result || []);
			},
			onSave: async function(illust, force) {
				let iid = illust.iid;

				if(~~illust.ugoira) {
					window.open(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.iid}`);

					return;
				}

				let stat1 = await A.post('save', { iid, force });

				if(stat1) {
					this.$set(illust, 'stat1', stat1);

					if(stat1 != '准备下载') {
						return;
					}
				}

				WC.add(`save-${iid}`, 'listFollow', function(stat) {
					let map = stat.map;
					let count = stat.count;

					let done = 0;
					let percent = 0;

					illust.ding = true;

					for(let pstat of map) {
						if(pstat.strt) {
							if(pstat.down) {
								++done;
							}
							else if(!pstat.ding) {
								++done;
							}
						}

						percent += pstat.percent || 0;

						// L('	', pstat.pid, pstat.strt, pstat.ding, pstat.down, pstat.percent);
					}

					// L(iid, done, percent, Math.round(percent/count));

					this.$set(illust, 'stat1', count < 0 ? '解析中' : `[${done}/${count}]`);
					this.$set(illust, 'stat2', `${Math.round(percent/count)}%`);

					if(done == count) {
						WC.del(`save-${iid}`, 'listFollow');

						illust.ding = false;
						illust.down = true;
					}
				}.bind(this));
			},
			onSaveAll: function(force = false) {
				for(let illust of this.data) {
					this.onSave(illust, force);
				}
			}
		}
	};
</script>

<style scoped>
	.topbar {
		position: relative;

		margin: 10px;

		width: calc(100% - 20px);

		font-size: 0px;

		background: #181e23;
	}

	.thumbBox {
		position: relative;

		box-sizing: border-box;

		width: 100%;
		height: calc(100% - 55px);

		overflow: auto;

		font-size: 0px;
	}

	.thumb {
		box-sizing: border-box;

		width: calc(20% - 20px);
		height: calc(25% - 11px);

		margin: 0px 10px 10px 10px;

		cursor: pointer;
	}
	.thumb.down {
		border-color: darkgreen;
	}
	.thumb.ding {
		border-color: orange;
	}
	.thumb:hover {
		border-color:#0185e6;
	}
</style>