<template>
	<div class="compProcmProduct">
		<sTopbar class="topbar">
			<Texter class="onLeft" v-model="query.word" label="搜索" width="200" @keyup.enter.native="onQuery(1)"></Texter>
			<Combo class="onLeft" v-model="query.mode" :list="B.data.mode" @input="onQuery(1)" width="60"></Combo>
			<Combo class="onLeft" v-model="query.type" :list="B.data.itype" @input="onQuery(1)" width="60"></Combo>
			<Combo class="onLeft" v-model="query.smode" :list="B.data.smode" @input="onQuery(1)" width="120"></Combo>
			<sButton class="onLeft" text="全部下载" @click="onSaveAll(false)"></sButton>
			<sButton class="onLeft" text="全部强制下载" @click="onSaveAll(true)"></sButton>
			<div class="textBox inline onLeft">共 {{total}} ({{undown}}) 张</div>

			<pPager class="onRight" v-model="query.page"
				@keyup.enter.native="onQuery(query.page)" :onoffset="onQuery"
			></pPager>
		</sTopbar>

		<div class="thumbBox">
			<pThumb class="thumb inline" v-for="(illust, illustIndex) of data" :key="`thumb-${illustIndex}`"
				:illust="illust"
				@click.native="onSave(illust, $event)"
			></pThumb>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return X.init(this.$options._componentTag, {
				dict: {}
			}, {
				data: {},
				tab: {},
			}, {
				data: [],

				total: 0,
				undown: 0,
				// 和分页、筛选有关的可变的值
				query: {
					page: 1,

					word: '',
					type: 'all',
					mode: 'all',
					smode: 's_tag_tc'
				},

				rids: new Set(),
			});
		},

		created: function() {
			A.reg('listSearch', 'api/listSearch');
		},
		mounted: async function() {
			this.onQuery();
		},

		watch: {
			'S.data': async function(query) {
				this.query = query;

				this.onQuery();
			}
		},

		methods: {
			onQuery: async function(page) {
				if(~~page) {
					this.query.page = ~~page;
				}
				else {
					this.query.page = 1;
				}

				let result = await A.conn('listSearch', this.query);

				this.$set(this, 'data', result);

				this.S.tab.name = '搜索: ' + this.query.word;

				this.rids.clear();

				BUS.dictSearch = {};

				let total = 0;
				let undown = 0;
				for(let item of result) {
					BUS.dictSearch[item.iid] = item;

					total += item.count;

					undown += item.down ? 0 : item.count;
				}

				this.total = total;
				this.undown = undown;
			},
			onSave: async function(illust, event, force) {
				let { iid, count, type, time } = illust;

				if(illust.type == 2) {
					window.open(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.iid}`);
				}
				else if(event.altKey) {
					let rids = this.rids;

					if(rids.has(illust)) {
						rids.delete(illust);
						this.$set(illust, 'rid', false);
					}
					else {
						rids.add(illust);
						this.$set(illust, 'rid', true);
					}
				}
				else {
					W.cast('api/save', { iid, count, type, time, force: event.ctrlKey || force });
				}
			},
			onSaveAll: function(force = false) {
				for(let illust of this.data) {
					if(!this.rids.has(illust)) {
						this.onSave(illust, {}, force);
					}
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
		height: calc(33% - 11px);

		margin: 0px 10px 10px 10px;

		cursor: pointer;
	}
	.thumb.rid {
		border-color: darkred;
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

	.textBox {
		height: 22px;
		padding: 0px 10px;
		line-height: 22px;
	}
</style>