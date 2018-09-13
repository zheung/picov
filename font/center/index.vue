<template>
	<div class="compTaskCenter">
		<!-- 顶栏 -->
		<div class="line r2">
			<sPanel title="任务1">
			</sPanel>
			<sPanel title="任务2"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
		</div>
		<div class="line r3">
			<sPanel title="任务1"><Texter width="200" v-model="query.testTag"></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务2"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务3"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
		</div>
		<div class="line r4">
			<sPanel title="任务1"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务2"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务3"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务4"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
		</div>
		<div class="line r5">
			<sPanel title="任务1"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务2"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务3"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务4"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务5"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
		</div>
		<div class="line r6">
			<sPanel title="任务1"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务2"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务3"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务4"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务5"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
			<sPanel title="任务6"><Texter width="200" ></Texter><Texter width="200" ></Texter></sPanel>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				query: {
					name: '1',

					testTag: '测试;百度;广州普勒仕交通科技有限公司'
				},

				deConf: {
					width: 250,
					labelWidth: 80,
					labelAlign: 'right',
				},
			};
		},

		created: function() {
			A.reg('docFileList', 'uapi/docFileListEms');
		},
		mounted: async function() {
		},

		methods: {
		}
	};
</script>

<style scoped>
	.compTaskCenter {
		padding: 10px;

		min-width: 1200px;

		font-size: 0;
	}

	.line {
		margin-bottom: 10px;
	}
	.line:last-child {
		margin-bottom: 0px;
	}

	.line>* {
		position: relative;

		display: inline-block;
		vertical-align: top;

		box-sizing: border-box;

		margin: 0px 5px 0px 5px;
	}
	.line>*:first-child {
		margin: 0px 5px 0px 0px;
	}
	.line>*:last-child {
		margin: 0px 0px 0px 5px;
	}

	.line.r2>* { width: calc(50% - 10px); }
	.line.r2>*:first-child, .line.r2>*:last-child { width: calc(50% - 5px); }

	.line.r3>* { width: calc(34% - 10px); }
	.line.r3>*:first-child, .line.r3>*:last-child { width: calc(33% - 5px); }

	.line.r4>* { width: calc(25% - 10px); }
	.line.r4>*:first-child, .line.r4>*:last-child { width: calc(25% - 5px); }

	.line.r5>* { width: calc(20% - 10px); }
	.line.r5>*:first-child, .line.r5>*:last-child { width: calc(20% - 5px); }

	.line.r6>* { width: calc(17% - 10px); }
	.line.r6>*:first-child, .line.r6>*:last-child { width: calc(16% - 5px); }

	@media screen and (max-width: 1230px) {
		.compTaskCenter {
			background: darkcyan;
		}
	}
</style>