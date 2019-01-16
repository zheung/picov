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
			<pThumb class="thumb inline" v-for="(illust, illustIndex) of data" :key="`thumb-${illustIndex}`" :illust="illust" :index="illustIndex"></pThumb>
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
			});
		},

		created: function() {
			A.reg('listSearch', 'api/listSearch');
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

				this.S.tab.name = '搜索: ' + (this.query.title || this.query.word);

				let total = 0;
				let undown = 0;

				for(let item of result) {
					let stat = BUS.dictIllust[item.iid];

					if(!stat) {
						this.$set(BUS.dictIllust,item.iid, stat = {
							statL: '',
							statR: '',

							rid: false,

							ding: false,
							down: false,

							frames: []
						});
					}

					item.stat = stat;

					stat.ding = item.ding;
					stat.down = item.down;
					stat.frames = item.frames || [];

					total += item.count;

					undown += item.down ? 0 : item.count;
				}

				this.total = total;
				this.undown = undown;
			},
			onSaveAll: function(force = false) {
				for(let illust of this.data) {
					if(!illust.stat.rid && !illust.stat.ding && illust.onSave) {
						illust.onSave({}, force);
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