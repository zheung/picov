<template>
	<div class="compProcmProduct">
		<sTopbar class="topbar">
			<Texter class="onLeft" v-model="query.key" label="搜索" width="200" @keyup.enter.native="onQuery"></Texter>

			<!-- <sButton class="onRight" text="查询" @click="onQuery">查询</sButton> -->
			<Pager class="onRight" v-model="query.page"
				@keyup.enter.native="onQuery(query.page)" :onoffset="onQuery"
			></Pager>
		</sTopbar>

		<div class="thumbBox">
			<Thumb class="thumb inline" v-for="(illust, illustIndex) of data" :key="`thumb-${illustIndex}`" :illust="illust" @click.native="onSave(illust.iid)"></Thumb>
		</div>
	</div>
</template>

<script>
	import Thumb from './Thumb';

	export default {
		components: { Thumb },

		data: function() {
			return {
				data: [],

				// 和分页、筛选有关的可变的值
				query: {
					page: 1,

					key: ''
				},
			};
		},

		created: function() {
			A.reg('listFollow', 'uapi/listFollow');
			A.reg('save', 'uapi/save');
		},
		mounted: async function() {
			this.onQuery();
		},

		methods: {
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
			onSave: function(iid) {
				WC.add(`save-${iid}`, 'listFollow', function() {

				});
				A.post('save', { iid });
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

		background: snow;
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
	.thumb.ding {
		border: 1px solid red;
	}
	.thumb.down {
		border: 1px solid green;
	}
	.thumb:hover {
		border: 1px solid #0185e6;
		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 1);
	}
</style>