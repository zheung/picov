<template>
	<div class="compProcmProduct">
		<!-- 顶栏 -->
		<sPanel class="topbar" padding="5px">
			<Texter class="onLeft" v-model="query.key" label="搜索" width="200" @keyup.enter.native="onQuery"></Texter>
			<!-- <Combo class="onLeft" v-model="query.key" label="" :list="B.data.procmSupplier" width="200" @input="onQuery" filter></Combo> -->

			<sButton class="inline" text="查询" @click="onQuery">查询</sButton>

			<!-- <sButton class="onRight inline" text="新增" @click="onAdd"></sButton> -->
		</sPanel>
		<!-- 表格 -->
		<sPanel class="thumbBox" title="图片列表">
			<div class="thumb inline" v-for="(illust, illustIndex) of data" :key="`thumb-${illustIndex}`">
				<img
					class="thumb curp"
					:src="'uapi/thumb?iid='+illust.iid+'&time='+illust.time+'&ugoira='+illust.ugoira"
					:title="illust.iid"
					@error="imgError"
				/>
				<div>{{illust.title}}</div>
			</div>
		</sPanel>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				nowCol: null,

				zIndex: -1,

				// 表格头
				title: [
					{ text: 'ID', index: 'id', width: 45, align: 'center' },
					{ text: '名称', index: 'name', width: 160, align: 'center' },
					{ text: '标签', index: 'type_tag', width: 200 },
					{ text: '厂商', index: 'sup_name', width: 160, align: 'center' },
					{ text: '主要参数', index: 'main_param', width: 200 },
					{ text: '其他参数', index: 'sub_param', width: 200 },
					{ text: '备注', index: 'row_mark', width: 200 }
				],

				data: [],
				total: 0,

				// 和分页、筛选有关的可变的值
				query: {
					page: 1,
					limit: 40,

					key: '',

					tag: '',
				},

				// 一般不变的默认值
				methodList: [
					{ name: '全部', code: '' },
					{ name: 'GET', code: 'get' },
					{ name: 'POST', code: 'post' },
				],
				methodList2: [
					{ name: 'GET', code: 'get' },
					{ name: 'POST', code: 'post' },
				],
				typeList: [
					{ name: '数据接口', code: 1 },
					{ name: '操作接口', code: 2 },
					{ name: '上传接口', code: 3 },
					{ name: '下载接口', code: 4 },
				],

				today: moment(),

				B: BUS
			};
		},

		created: function() {
			A.reg('listFollow', 'uapi/listFollow');

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
			// 查询接口
				let result = await A.conn('listFollow', this.query);

				this.$set(this, 'data', result || []);
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

		color: #495051;
		background: snow;
	}
	.topbar>* {
		font-size: 12px;
	}
	.topbar>.onLeft {
		margin-right: 5px;
	}
	.topbar>.onRight {
		float: right;

		margin-left: 5px;
	}

	.thumbBox {
		position: relative;

		margin: 10px 0px 0px 10px;

		width: calc(100% - 20px);
		height: calc(100% - 70px);

		font-size: 0px;
		color: #495051;
		background: snow;
	}
</style>