<template>
	<div class="compProcmProduct">
		<sTopbar class="topbar">
			<Texter v-model="query.word" class="onLeft" label="搜索" width="200" @keyup.enter.native="onSearch" />
			<Combo v-model="query.mode" class="onLeft" :list="B.data.mode" width="60" />
			<Combo v-model="query.type" class="onLeft" :list="B.data.itype" width="60" />
			<Combo v-model="query.smode" class="onLeft" :list="B.data.smode" width="120" />
			<sButton class="onLeft" text="全部下载" @click="onSaveAll" />
			<div class="textBox inline onLeft">共 {{total}} ({{undown}}) 张</div>

			<pPager v-model="query.page" class="onRight"
				:onoffset="onQuery"
				@keyup.enter.native="onQuery(query.page)"
			/>
		</sTopbar>

		<div class="thumbBox">
			<pThumb
				v-for="(illust, illustIndex) of data" :key="`thumb-${illustIndex}`"
				class="thumb inline"
				:illust="illust" :index="illustIndex"
			/>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				data: [],

				total: 0,

				query: {
					listMode: 'follow',

					page: 1,

					word: '',
					type: 'all',
					mode: 'all',
					smode: 's_tag_tc'
				},

				B: BUS
			};
		},

		computed: {
			'undown': function() {
				let undown = 0;

				for(let item of this.data) {
					let stat = item.stat;

					undown += item.down ? 0 : item.count - stat.downCount;
				}

				return undown;
			}
		},

		mounted: async function() {
			this.onQuery();
		},

		methods: {
			onSearch: async function() {
				if(~~this.query.word) {
					BUS.changeNumber(~~this.query.word);
				}
				else {
					BUS.changeSearch(this.query);
				}
			},
			onQuery: async function(page) {
				if(~~page) {
					this.query.page = ~~page;
				}
				else {
					this.query.page = 1;
				}

				let result = await A.conn('list', this.query);

				this.$set(this, 'data', result);

				let total = 0;

				for(let item of result) {
					let stat = BUS.dictIllust[item.iid];

					if(!stat) {
						this.$set(BUS.dictIllust, item.iid, stat = {
							statL: '',
							statR: '',

							rid: false,

							ding: false,
							down: false,

							files: [],

							downCount: 0
						});
					}
					else {
						stat.item = item;
					}

					item.stat = stat;

					stat.ding = item.ding;
					stat.down = item.down;
					stat.downCount = item.downCount;
					stat.files = item.files || [];

					total += item.count;
				}

				this.total = total;
			},
			onSaveAll: function(event = {}, force = event.ctrlKey || false) {
				for(let illust of this.data) {
					if(!illust.stat.rid && illust.onSave) {
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