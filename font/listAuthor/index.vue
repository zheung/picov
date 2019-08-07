<template>
	<div class="compProcmProduct">
		<sTopbar class="topbar">
			<Texter class="onLeft" v-model="query.word" label="搜索" width="200" @keyup.enter.native="onQuery(1)"></Texter>
			<Combo class="onLeft" v-model="query.type" :list="B.data.itype" @input="onQuery(1)" width="60"></Combo>
			<sButton class="onLeft" text="全部下载" @click="onSaveAll"></sButton>
			<div class="textBox inline onLeft">共 {{total}} ({{undown}}) 张</div>

			<pPager class="onRight" v-model="query.page"
				@keyup.enter.native="onQuery(query.page)" :onoffset="onQuery"
			></pPager>
			<div class="textBox inline onRight">{{follow?'关注中':'未关注'}}</div>
			<sButton class="onRight" text="作者链接" @click="onOpenAuthor"></sButton>
		</sTopbar>

		<div class="thumbBox">
			<pThumb class="thumb inline" v-for="(illust, illustIndex) of data" :key="`thumb-${illustIndex}`" :illust="illust" :index="illustIndex" :wrap="6"></pThumb>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return X.init(this.$options._componentTag, {
				dict: {}
			}, {
				tab: {},

				uid: 0,
				user: '',
			}, {
				data: [],

				total: 0,
				undown: 0,
				// 和分页、筛选有关的可变的值
				query: {
					listMode: 'author',

					page: 1,

					follow: false,

					uid: 0,
					type: 'all',
				},
			});
		},

		created: function() {
		},

		watch: {
			'S.uid': async function(uid) {
				this.query.uid = uid;

				this.onQuery();

				let stat = await A.conn('statAuthor', { uid });

				this.follow = stat.follow;
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

				let result = await A.conn('list', this.query);

				this.$set(this, 'data', result);

				this.S.tab.name = '作者: ' + this.S.user;

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

							files: []
						});
					}

					item.stat = stat;

					stat.ding = item.ding;
					stat.down = item.down;
					stat.files = item.files || [];

					total += item.count;

					undown += item.down ? 0 : item.count;
				}

				this.total = total;
				this.undown = undown;
			},
			onSaveAll: function(event = {}, force = event.ctrlKey || false) {
				for(let illust of this.data) {
					if(!illust.stat.rid && illust.onSave) {
						illust.onSave({}, force);
					}
				}
			},
			onOpenAuthor: async function() {
				window.open(`https://www.pixiv.net/member_illust.php?id=${this.S.uid}&type=illust`);
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

		width: calc(16.666% - 20px);
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