<template>
	<div class="compEditor nosel" ref="editor">
		<!-- 表单 -->
		<div class="line" v-if="conf.actionType=='Mod'">
			<Labler class="comp" v-model="conf.query.face_id" label="ID" :conf="deConf" multi="2"></Labler>
		</div>
		<div class="line">
			<Combo class="comp" v-model="conf.query.type" label="接口类型" :list="conf.typeList" :conf="deConf" multi="2"></Combo>
		</div>
		<div class="line">
			<Combo class="comp" v-model="conf.query.method" label="请求方法" :list="conf.methodList" :conf="deConf" multi="2"></Combo>
		</div>
		<div class="hr"></div>
		<div class="line">
			<Texter class="comp" v-model="conf.query.path" label="路由" :conf="deConf" multi="2" ></Texter>
		</div>
		<div class="line">
			<Texter class="comp" v-model="conf.query.entry" label="入口" :conf="deConf" multi="2" ></Texter>
		</div>
		<div class="line">
			<TxArea class="comp" v-model="conf.query.row_mark" label="备注" :conf="deConf" multi="2" row="2"></TxArea>
		</div>
		<div class="line right">
			<div class="button nosel white trans" @click="onClear">清空</div>
			<div class="button nosel trans" @click="onAdd">{{conf.actionName || '确定'}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			conf: { default: function() { return {}; } },
		},
		data: function() {

			return {
				top: 0,
				left: 0,
			// deConf默认是50%的宽度，控件mulit="2"则变成100%的宽度
				deConf: {
					width: 160,
					labelWidth: 80,
					labelAlign: 'right',
				}
			};
		},
		methods: {
			onAdd: async function() {
				let conf = this.conf;

				try {
					let result = await A.post(conf.action, conf.query);

					if(result) {
						await X.alert(`${conf.actionName || '操作'}成功`);

						X.wins.hide();

						this.conf.onQuery();
					}
				}
				catch(error) {
					await X.alert(`${conf.actionName || '操作'}失败。原因[${error.text || error}]`, '错误');
				}
			},
			onClear: function() {
			// 清空要自己写
				let query = this.conf.query;

				query.entry = '';
				query.extra_flow = '';
				query.row_mark = '';
			},
		},

	};
</script>

<style scoped>
	.compEditor {
		position: relative;

		font-size: 12px;

		padding: 10px 20px 10px 20px;

		border-radius: 0px 0px 4px 4px;

		background: snow;
	}

	.line {
		display: block;

		margin-top: 10px;
		margin-bottom: 10px;

		font-size: 0;
	}
	.line.right {
		text-align: right;
	}

	.button {
		display: inline-block;
		border: 1px solid transparent;
		border-radius: 4px;

		background: #1faaf1;

		color: snow;
		width: 60px;
		height: 24px;

		overflow: hidden;
		text-align: center;
		line-height: 24px;
		cursor: pointer;

		font-size: 12px;

		margin-left: 5px;
	}
	.button.white {
		background: snow;

		color: #1faaf1;
	}
	.button:hover {
		box-shadow: 1px 1px 4px -1px #3d94d4;
		border: 1px solid #3d94d4;
	}

	.hr {
		border-top: 1px solid transparent;
		border-bottom: 1px solid transparent;
		margin: 10px 0px 10px 15px;
	}
</style>