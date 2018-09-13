<template>
	<div class="compGrid" >
		<div class="titleBox" v-if="!hideHead_">
			<div class="col title" :style="{ left: left+'px', 'min-width': minWidth+'px' }">
				<div class="cell center" :style="{ width: '20px' }" v-if="multiSelect_" ></div>
				<div v-for="(row, rid) of title" :key="`grid-title-${row.text}-${rid}`"
					class="cell"
					:class="row.align ? row.align : ''"
					:style="{ width: (row.width || 60)+'px' }"
					v-html="row.text"
				></div>
			</div>
		</div>
		<div class="colBox" @scroll="onScrollBody" :class="{ hidePage: hidePage_, hideHead: hideHead_ }" v-if="!hideBody_">
			<div v-for="(col, cid) of data" :key="`grid-col-${cid}`"
				class="col"
				:class="{ select: !hideSelect_, odd: cid%2==1, now: multiSelect_ ? seleArr.indexOf(col)+1 : now === col }"
				:style="{ 'min-width': minWidth+'px' }"
				@click="onSelect(col)"
			>
				<div class="cell center nosel" v-if="multiSelect_" :style="{ width: '20px' }">
					<Fas
						:icon="seleArr.indexOf(col)+1 ? ['fas', 'check-circle' ] : ['far', 'circle' ]"
						:style="{ color: seleArr.indexOf(col)+1 ? 'green' : 'unset' }"
					></Fas>
				</div>
				<div v-for="(row, rid) of title" :key="`grid-cell-${cid}-${rid}`"
					class="cell"
					:class="[row.align ? row.align : null, !row.sel ? 'nosel' : null ]"
					:title="row.title ? col[row.index]: null"
					:style="{ width: (row.width || 60)+'px', fontWeight: row.bold ? 'bold' : false }"
					v-html="col[row.index]"
				></div>
			</div>
		</div>
		<div class="pager nosel" v-if="!hidePage_">
			<div class="trans button" :class="{ invalid: pageNow == 1 }" @click="onQuery(1)"><Fas class="rightButton" :icon="['fas', 'angle-double-left']" /></div>
			<div class="trans button" :class="{ invalid: pageNow == 1 }" @click="onQuery(pageNow-1)"><Fas class="rightButton" :icon="['fas', 'angle-left']" /></div>

			<input type="text" class="value sel" v-model="pageNow" @keyup.enter="onQuery(pageNow)" />
			<div class="trans button split">/</div>
			<div class="page">{{pageMax}}</div>

			<div class="trans button" :class="{ invalid: pageNow == pageMax }" @click="onQuery(pageNow+1)"><Fas class="rightButton" :icon="['fas', 'angle-right']" /></div>
			<div class="trans button" :class="{ invalid: pageNow == pageMax }" @click="onQuery(pageMax)"><Fas class="rightButton" :icon="['fas', 'angle-double-right']" /></div>
			<div class="trans button split">|</div>
			<div class="trans button" @click="onQuery(pageNow)"><Fas class="rightButton" :icon="['fas', 'sync-alt']" /></div>
			<div class="count sel">共 {{total}} 条</div>
			<div class="count sel" v-if="multiSelect_">已选 {{seleArr.length}} 条 | </div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: { default: [] },
			data: { default: [] },
			page: { default: 1 },
			limit: { default: 20 },
			total: { default: 0 },
			onquery: { default: function() { return function() {}; }},

			hidehead: {},
			hidebody: {},
			hidepage: {},
			hideselect: {},
			multiselect: {},

			value: {}
		},
		data: function() {
			let minWidth = this.title.length;

			for(let row of this.title) {
				minWidth += (~~row.width || 70)+20;

				if(row.title === false || row.title == 'false') {
					row.title = false;
				}
				else {
					row.title = true;
				}
			}

			let hidePage_ = false;
			if(this.hidepage != undefined && (this.hidepage != 'false' || this.hidepage !== false)) { hidePage_ = true; }

			let hideHead_ = false;
			if(this.hidehead != undefined && (this.hidehead != 'false' || this.hidehead !== false)) { hideHead_ = true; }

			let hideBody_ = false;
			if(this.hidebody != undefined && (this.hidebody != 'false' || this.hidebody !== false)) { hideBody_ = true; }

			let hideSelect_ = false;
			if(this.hideselect != undefined && (this.hideselect != 'false' || this.hideselect !== false)) { hideSelect_ = true; }

			let multiSelect_ = false;
			if(this.multiselect != undefined && (this.multiselect != 'false' || this.multiselect !== false)) { multiSelect_ = true; }

			if(multiSelect_) {
				minWidth += 40;
			}

			return {
				left: 0,
				minWidth,
				pageNow: this.page,
				now: null,

				hideHead_,
				hidePage_,
				hideBody_,
				hideSelect_,
				multiSelect_,

				seleArr: [],
			};
		},
		watch: {
			page: function(now) {
				this.pageNow = now;
			},
			title: function() {
				let minWidth = this.title.length;

				for(let row of this.title) {
					minWidth += (~~row.width || 70)+20;
				}

				this.minWidth = minWidth;
			},
			value: function(now) {
				this.now = now;
			},
			data: function() {
				this.seleArr.splice(0, this.seleArr.length);
			}
		},
		methods: {
			onScrollBody: function(eve) {
				if(eve && eve.target) {
					this.left = -eve.target.scrollLeft || 0;
				}
			},
			onQuery: function(page) {
				if(page<=0 || page > this.pageMax) { return; }

				this.pageNow = page;

				if(typeof this.onquery == 'function') {
					this.onquery(page);
				}

			},
			onSelect: function(item) {
				if(this.hideSelect_) { return; }

				if(this.multiSelect_) {
					let seleArr = this.seleArr;

					let index = seleArr.indexOf(item);

					if(index+1) {
						seleArr.splice(index, 1);
					}
					else {
						seleArr.push(item);
					}

					this.$emit('input', seleArr);
				}
				else {
					this.now = item;
					this.$emit('input', item);
				}

			}
		},
		computed: {
			pageMax: function() {
				return Math.ceil(this.total / this.limit);
			}
		}
	};
</script>

<style scoped>
	.compGrid {
		display: block;

		border-radius: 4px;
		box-shadow: 2px 2px 7px -2px rgba(128, 128, 128, 0.7);

		border: 1px solid #dedede;

		font-size: 12px;

		padding: 6px 5px 5px 5px;

		color: #495051;
		background: snow;

		overflow: hidden;
	}
	.titleBox {
		position: absolute;

		top: 5px;
		left: 5px;
		right: 5px;

		border-top: 1px solid #b3b3b3;
		border-left: 1px solid #b3b3b3;
		border-right: 1px solid #b3b3b3;

		border-radius: 3px 3px 0px 0px;

		overflow: hidden;
		z-index: 1;

		background: #d5edf9;
	}
	.colBox {
		position: absolute;

		top: 40px;
		bottom: 35px;
		left: 5px;
		right: 5px;

		border: 1px solid #b3b3b3;

		border-radius: 0px 0px 3px 3px;

		overflow: auto;
		z-index: 2;
	}
	.colBox.hideHead {
		top: 5px;
	}
	.colBox.hidePage {
		bottom: 5px;
	}

	.pager {
		position: absolute;

		bottom: 5px;
		left: 5px;
		right: 5px;

		height: 25px;

		color: #495051;

		overflow: hidden;
		z-index: 2;
	}

	.pager>* {
		display: inline-block;
		vertical-align: top;

		font-size: 12px;
		text-align: center;

		margin-left: 4px;
		margin-right: 4px;

		height: 23px;
		line-height: 23px;

		text-align: center;

		border: 1px solid transparent;
	}

	.pager>.button {
		border: 1px solid lightgray;

		border-radius: 3px;

		width: 35px;

		text-align: center;

		cursor: pointer;
	}
	.pager>.button:not(.elli):not(.split):hover {
		background: #1faaf1;
		border-color: #1faaf1;

		color: snow;
	}
	.pager>.button.invalid:hover {
		background: snow;
		border-color: lightgray;

		color: snow;
	}
	.pager>.button.invalid {
		cursor: not-allowed;

		color: lightgray;
	}

	.pager>.button.elli {
		border: 1px solid transparent;

		color: #cccccc;

		cursor: default;
	}
	.pager>.button.split {
		border: 1px solid transparent;

		width: 20px;

		margin-left: -4px;
		margin-right: -4px;

		color: #cccccc;

		cursor: default;
	}

	.pager>.value {
		width: 30px;
		height: 21px;

		margin-left: 0px;
		margin-right: -4px;

		outline: none;

		color: #495051;
		font-size: 12px;
		background: snow;
	}
	.pager>.page {
		width: 30px;

		margin-left: -4px;
		margin-right: 0px;

		border-color: transparent;
	}
	.pager>.count {
		border-color: transparent;

		float: right;
	}

	.col {
		width: 100%;
		height: 24px;

		font-size: 0px;

		background: snow;

		white-space: nowrap;
	}
	.col:not(:first-child) {
		border-top: 1px solid lightgray;
	}


	.col.select:hover, .col.select.now {
		background: #cdeaff !important;

		border-top: 1px dashed #7d7d7d;
	}
	.col.select:hover+.col.select, .col.select.now+.col.select {
		border-top: 1px dashed #7d7d7d;
	}
	.col.select:first-child {
		border-top: 0px;
	}

	.colBox>.col.odd {
		background: #f7f7f7;
	}
	.colBox>.col:last-child {
		border-bottom: 1px solid lightgray;
	}


	.cell {
		display: inline-block;
		border-left: 1px solid rgba(61, 70, 76, 0.1);

		height: 100%;

		padding-left: 10px;
		padding-right: 10px;

		overflow: hidden;

		font-size: 12px;
		line-height: 24px;

		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.cell.center {
		text-align: center;
	}
	.cell:first-child {
		border-left: 0px;
	}
	.cell::after {
		contain: 'a';
	}

	.cell>.check {
		margin: 6px 0px 0px 3px;

		width: 14px;
		height: 14px;
	}

	.col.title {
		position: relative;

		height: 35px;

		background: #d5edf9;
	}
	.col.title>.cell {
		line-height: 35px;
	}
</style>