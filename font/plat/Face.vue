<template>
	<div>
		<!-- 顶栏 -->
		<div class="topbar" @mouseover="onOver" @mouseout="onOut">
			<Combo v-model="query.method" label="方法" :list="methodList" width="160" @input="onQuery"></Combo>
			<Texter v-model="query.path" label="路由" width="200" @keyup.enter.native="onQuery"></Texter>

			<div class="button nosel trans" @click="onQuery">查询</div>

			<div class="button nosel right trans" @click="onDel" v-if="perm.del">删除</div>
			<div class="button nosel right trans" @click="onMod" v-if="perm.mod">修改</div>
			<div class="button nosel right trans" @click="onAdd" v-if="perm.add">新增</div>
		</div>
		<!-- 表格 -->
		<Grid class="grid" :style="{ zIndex: zIndex }"
			v-model="nowCol"

			:title="title"
			:data="data"
			:page="query.page"
			:limit="query.limit"
			:total="total"
			:onquery="onQuery"
		>
		</Grid>
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
					{ text: 'ID', index: 'face_id', width: 45, align: 'center' },
					{ text: '数据类型', index: 'type_text', width: 80, align: 'center' },
					{ text: '方法', index: 'method', width: 40, align: 'center', },
					{ text: '路由', index: 'path', width: 160 },
					{ text: '流程', index: 'entry_name', width: 160 },
					{ text: '备注', index: 'row_mark', width: 160 }
				],

				data: [],
				total: 0,

				// 和分页、筛选有关的可变的值
				query: {
					page: 1,
					limit: 40,

					name: '',

					project: 0
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

				today: moment()
			};
		},

		created: function() {
		// 注册接口
			A.reg('platFaceList', 'uapi/platFaceList');
			A.reg('platFaceAdd', 'uapi/platFaceAdd');
			A.reg('platFaceMod', 'uapi/platFaceMod');
			A.reg('platFaceDel', 'uapi/platFaceDel');

			A.reg('platRoleCmb', 'uapi/platRoleCmb');
		},
		mounted: async function() {
		// 加载Combo、表格等
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
				let result = await A.conn('platFaceList', this.query);

				this.$set(this, 'data', result.infos || []);
				this.$set(this, 'total', result.total || 0);

				this.nowCol = null;
			},
			onOver: function() {
				this.zIndex = -1;
			},
			onOut: function() {
				this.zIndex = 0;
			},

			openEditor: async function(title, data) {
			// 定义编辑器
				let cid = 'faceEditor';

				if(!X.wins.init(cid)) {
				// 编辑器路径，注意必须写死，不然Webpack不能识别
					X.wins.init(cid, (await System.import('./FaceEditor')).default);
				}

				X.wins.show(cid, title, data);
			},
			onAdd: async function() {
			// 新建模式
				this.openEditor('添加记录', {
					mask: 3,

					onQuery: this.onQuery,
				// 添加接口
					action: 'platFaceAdd',
					actionName: '添加',
					actionType: 'Add',

					typeList: this.typeList,
					methodList: this.methodList2,

					query: {
						type: 1,
						method: 'get',

						path: '',
						entry: '',

						row_mark: ''
					}
				});
			},
			onMod: function() {
			// 编辑模式
				let now = this.nowCol;

				if(!now) {
					X.alert('请选择记录');
				}
				else {
					let test = {
						face_id: now.face_id,

						type: now.type,
						method: now.method,
						path: now.path,
						entry: now.entry,

						row_mark: now.row_mark
					};
					window.t1 = test;

					this.openEditor('修改记录', {
						mask: 3,
					// 修改接口
						action: 'platFaceMod',
						actionName: '修改',
						actionType: 'Mod',

						typeList: this.typeList,
						methodList: this.methodList2,
					// 注意query要复制，不能直接用now，不然表格跟着变
						query: test,

						onQuery: this.onQuery
					});
				}
			},
			onDel: async function() {
				let now = this.nowCol;

				if(!now) {
					X.alert('请选择记录');
				}
				else {
					let sure = await X.quest('确定删除记录吗？', '删除');

					if(sure) {
						try {
						// 删除接口
							let result = await A.post('platFaceDel', { face_id: now.face_id });

							if(result) {
								await X.alert('删除成功');

								this.onQuery();
							}
						}
						catch(error) {
							await X.alert(`删除失败。原因[${error.text || error}]`, '错误');
						}
					}
				}
			}
		}
	};
</script>

<style scoped>
	.topbar {
		position: absolute;

		left: 0px;
		right: 0px;

		display: block;
		border-radius: 4px;

		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 0.7);

		font-size: 12px;

		color: #495051;
		background: snow;

		padding-left: 10px;
	}
	.topbar>* {
		margin-top: 6px;
		margin-bottom: 5px;
	}

	.grid {
		position: absolute;

		top: 50px;
		left: 0px;
		right: 0px;
		bottom: 10px;
	}

	.button {
		display: inline-block;
		border: 1px solid transparent;
		border-radius: 4px;

		background: #1faaf1;
		color: snow;
		width: 40px;
		height: 20px;
		overflow: hidden;
		text-align: center;
		line-height: 20px;
		cursor: pointer;
	}
	.button.right {
		float: right;

		margin-right: 5px;
	}
	.button:hover {
		box-shadow: 1px 1px 4px -1px #3d94d4;
		border: 1px solid #3d94d4;
	}
</style>