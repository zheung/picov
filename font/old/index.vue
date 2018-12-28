<template>
	<div id="app" class="drr wpn jcs aic wpn">
		<div id="mainBox" class="blrBack drc jcc aic wpn">
			<div class="recoBox drr jca aic aca wpw">
				<div class="reco drc jcs ais ace wpn" :class="{ down: reco.down, ding: reco.ding }"
					v-for="(reco, i) of records" v-show="psub == parseInt(i/20)+1" @click="save(reco)" :key="`reco-${i}`"
				>
					<div class="detail thumb drr jcc aic acc">
						<img
							class="thumb curp"
							:src="'api/thumb?iid='+reco.iid+'&time='+reco.time+'&ugoira='+reco.ugoira"
							:title="reco.iid"
							@error="imgError"
						/>
					</div>
					<div class="detail drr jcs aic acc">
						<div class="icon jcc aic acc"><i class="fa fa-address-card-o"></i></div>
						<span
							class="text"
							:title="reco.title"
							:style="{ color: (reco.multi ? 'aqua' : (reco.ugoira ? 'violet' : '#E0E2E4'))}"
						>
							{{reco.title}}
						</span>
					</div>
					<div class="detail drr jcs aic acc">
						<div class="icon jcc aic acc"><i class="fa fa-user-o"></i></div>
						<span class="text">{{reco.user}}</span>
					</div>
				</div>
			</div>

			<div class="pageBox jcb aic">
				<a class="prev jcc aic" @click="turn(pageNow, -1)">上一页</a>
				<div class="count jcc aic">
					第<input type="text" ref="pager" v-model="pageNow" @keyup.enter="pageTurn" />页
					&nbsp;/&nbsp;{{psub}}&nbsp;子页
				</div>
				<a class="next jcc aic" @click="turn(pageNow, 1)">下一页</a>
			</div>
		</div>
		<div id="naviBox" class="blrNavi">
			<div class="tabBox Dash drc">
				<div class="headBox jca aih wpn">
					<a class="head jcc aic" @click="tabDash=1" v-bind:class="{ active: tabDash==1 }">中心</a>
					<a class="head jcc aic" @click="tabDash=2" v-bind:class="{ active: tabDash==2 }">收藏</a>
					<a class="head jcc aic" @click="tabDash=3" v-bind:class="{ active: tabDash==3 }">关于</a>
				</div>
				<div class="item drc aic jcs wpn" v-if="tabDash==1">
					<div class="wordBox NaviColumn jcb aic wpn">
						<input class="wf word" type="text" ref="worder" placeholder="关键词" v-model="wordNow" @keyup.enter="search" />
						<a class="w3 ButtonClick jcc" @click="r18Now = !r18Now">{{r18Now ? 'R18' : '全年龄'}}</a>
						<a class="w4 ButtonClick jcc" @click="search">搜索</a>
					</div>
					<div class="NaviColumn jcb aic wpn">
						<span class="sMean">当前列表：{{pageMean}}</span>
						<div>
							<i class="curp leftHeadButton fa fa-refresh" @click="listAuthorAll" title="清空记录"></i>
							<i class="curp leftHeadButton fa fa-refresh" @click="clear" title="清空记录"></i>
							<i class="curp leftHeadButton fa fa-download" @click="downloadAll" title="全部下载" style="margin-top: 1px;"></i>
							<i class="curp leftHeadButton fa" :class="{'fa-minus-square': logHide, 'fa-plus-square': !logHide}" @click="closeLog" title="隐藏日志" style="margin-top: 1px;"></i>
						</div>
					</div>
					<div class="logBox NaviColumn fs11 clrFontDark drc flex jcs ais wpn">
						<div class="logs fs11 clrFontDark drc flex jcs ais wpn">
							<span :style="{ color: logDict.CountProc.color }">{{logDict.CountProc.text}}</span>
							<span class="log" v-for="log in logs" :style="{ color: log.color }" v-if="logHide" :key="`log-${log.text}`">{{log.text}}</span>
						</div>
					</div>
				</div>
				<div class="item drc aic jcs wpn" v-if="tabDash==2">
					<div class="NaviColumn jcb aic wpn">
						<span class="curp aic" @click="pageFollow"><i class="fa fa-tag"></i>关注的作品</span>
					</div>
					<div class="tagBox NaviColumn drc flex jcs ais wpw" v-for="(arr, key) of tags" :key="`tagkeys-${key}`">
						<div class="title aic"><i class="fa fa-tag"></i>{{key}}</div>
						<div div class="tags NaviColumn clrFontDark curp drr flex jcs ais wpw">
							<span class="tag" @click="search(tag[1])" :title="tag[1]" v-for="tag of arr" :key="`tagkey-${tag[0]}`">{{tag[0]}}</span>
						</div>
					</div>
				</div>
				<div class="item drr jcc aic wpn" v-if="tabDash==3">
					<div class="item2 h81p clrFontDark fs20 flex drc jcb aic wpw">
						<div>
							<span class="fs24 fsb clrFont">P</span>icov&nbsp;
						</div>
						<div>
							<span class="fs24 fsb clrFont">Pixiv 浏览器</span>
						</div>
						<div>
							基于<span class="fs24 fsb clrFont">网页</span>
						</div>
						<div>
							自搭建<span class="fs24 fsb clrFont">服务器</span>
						</div>
						<div>
							强迫症患者的
							<span class="fs24 fsb clrFont">抓图工具</span>
						</div>
						<div>
							Make&nbsp;by&nbsp;
							<span class="fs24 fsb clrFont">DanoR</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import './rack.css';
	export default {
		data: function() {
			return {
				// io: io(),

				tabDash: 1,

				pageNow: 0,
				meanNow: 'listFollow',
				wordNow: '',
				r18Now: true,

				records: [],
				pageMean: '',

				psub: 1,

				tags: [],

				logs: [],
				logDict: { CountProc: { text: '下载中的作品： 0', color: '#557799' } },
				logHide: false
			};
		},

		created: function() {
			A.reg('docFileList', 'api/docFileListEms');
		},
		methods: {
			turn: async function(page, offset) {
				if(this.psub == 1 && this.records.length > 20 && offset == 1) {
					this.psub = 2;
				}
				else if(this.psub == 2 && offset == -1) {
					this.psub = 1;
				}
				else if(page+offset > 0) {
					this.io.emit(this.meanNow, this.params(page+offset, this.meanNow));

					let result = await A.conn(this.meanNow, this.params(page+offset, this.meanNow));

					this.psub = 1;
					this.records = result.records;
					this.pageNow = result.now;
					this.pageMean = result.mean;
				}
			},
			search: function(word) {
				this.wordNow = typeof word == 'string' ? word : this.wordNow;

				if(~~this.wordNow > 0) {
					this.meanNow = 'listAuthor';
				}
				else if(/member\.php/.test(this.wordNow)) {
					this.wordNow = this.wordNow.match(/id=(\d+)/)[1];
					this.meanNow = 'listAuthor';
				}
				else {
					this.meanNow = 'listSearch';
				}

				this.turn(0, 1);
			},
			pageFollow: function() {
				this.meanNow = 'listFollow';
				this.wordNow = '';

				this.turn(0, 1);
			},
			pageTurn:function() {
				this.turn(0, ~~this.pageNow);

				Vue.nextTick(function() {
					this.$refs.pager.blur();
				}, this);
			},
			params: function(page, mean) {
				if(mean == 'listFollow')
					return {
						p: (~~page > 0 ? ~~page : 1)
					};
				else if(mean == 'listAuthor')
					return {
						i: this.wordNow,
						p: (~~page > 0 ? ~~page : 1)
					};
				else if(mean == 'listSearch')
					return {
						p: (~~page > 0 ? ~~page : 1),
						w: this.wordNow,
						l: ~~this.r18Now
					};
			},
			save: function(reco) {
				if(~~reco.ugoira)
					window.open('https://www.pixiv.net/member_illust.php?mode=medium&illust_id='+reco.iid);
				else
					this.io.emit('save', { iid: reco.iid });
			},
			imgError: function() {
				let src = this.src;

				if(!/fr=/.test(src)) {
					this.src = src.replace(/\?/, '?fr=1&');
				}
			},
			clear: function() {
				this.logs = [];
				this.logDict = { CountProc: this.logDict.CountProc };
			},
			downloadAll: function() {
				let self = this;

				this.records.map(function(reco) {
					self.save(reco);
				});
			},
			closeLog: function() {
				this.logHide = !this.logHide;
				this.io.emit('downLog', this.logHide);
			},
			listAuthorAll: function() {
				this.io.emit('listAuthorAll', this.wordNow);
			}
		},
		mounted: async function() {
			A.reg('listFollow', 'api/listFollow');

			// (function() {
			// 	this.io.on('list', function(result) {
			// 	});

			// 	this.io.on('listTag', function(list) {
			// 		this.tags = list;
			// 	});

			// 	this.io.on('save', function(iid, down, ding) {
			// 		this.records.map(function(r) {
			// 			if(r.iid == iid) {
			// 				Vue.set(r, 'down', down);
			// 				Vue.set(r, 'ding', ding);
			// 			}
			// 		});
			// 	});

			// 	this.io.on('log', function(text, id, color) {
			// 		let log = { text: text, color: color || '#557799' }, logOld = this.logDict[id];

			// 		if(logOld) {
			// 			logOld.text = text;
			// 			logOld.color = color || '#557799';
			// 		}
			// 		else {
			// 			if(id) this.logDict[id] = log;

			// 			if(this.logs.length>50)
			// 				this.clear();

			// 			this.logs.unshift(log);
			// 		}
			// 	});
			// })();
			// (function() {
			// 	let isInput =function(tagName) {
			// 			return tagName == 'input' || tagName == 'textarea';
			// 		},
			// 		inArr =function(code, arr) {
			// 			for(let i in arr)
			// 				if(arr[i] == code)
			// 					return true;

			// 			return false;
			// 		};

			// 	window.keyInit = function() {
			// 		document.addEventListener('keyup', function(e) {
			// 			let ae = document.activeElement, tagName = ae.tagName.toLowerCase();

			// 			if(!isInput(tagName)) {
			// 				if(inArr(e.keyCode, [65,33,74])) { this.turn(this.pageNow, -1); return false; } //a, pup, j
			// 				else if(inArr(e.keyCode, [68,34,75])) { this.turn(this.pageNow, 1); return false; } //d, pdn, k
			// 				else if(e.keyCode == 67 && e.shiftKey) { //c
			// 					this.clear();

			// 					return false;
			// 				}
			// 				else if(e.keyCode == 71 && e.shiftKey) { //g
			// 					this.$refs.pager.focus();

			// 					return false;
			// 				}
			// 				else if(e.keyCode == 83 && e.shiftKey) { //s
			// 					this.$refs.worder.focus();

			// 					return false;
			// 				}
			// 				else if(e.keyCode == 69) { //e
			// 					this.downloadAll();

			// 					return false;
			// 				}
			// 			}
			// 		});
			// 	};
			// })();

			// this.turn(0, 1);
			// this.io.emit('listTag');
		}
	};
</script>

<style scoped>
	* {
		display: flex;
	}
	input, span {
		outline: none;
	}
	input {
		border: 1px solid transparent;

		background-color: #34495e;
		color: #E0E2E4;

		font-size: 16px;
	}
	input:focus {
		border-bottom: 1px solid #E0E2E4;
	}

	select {
		width: 50%;
		background-color: #34495e;
		color: #E0E2E4;
		border-radius: 2px;
		border: 2px solid transparent;
		border-left: 2px solid #E0E2E4;
	}

	a {
		text-decoration: none;
		color: #E0E2E4
	}
	a:visited {
		color: #E0E2E4;
	}

	/*-------app-------*/
	#app {
		height: 100%;
		width: 100%;

		background-color: green;
	}

	#mainBox {
		height: 100%;
		width: 100%;

		flex: 1
	}
	#naviBox {
		height: 100%;
		width: 450px;

		overflow: hidden;
		overflow-y: auto;
	}

	/*-------recoBox-------*/
	.recoBox {
		width: 100%;
		height: 95%;
	}
	.recoBox>.reco {
		border: 2px solid #557799;
		border-radius: 4px;

		width: 19%;
		height: 24%;

		font-size: 14px;
	}
	.recoBox>.reco:hover {
		border: 2px solid #E0E2E4;
	}
	.recoBox>.reco.ding {
		border: 2px solid red;
	}
	.recoBox>.reco.down {
		border: 2px solid yellow;
	}
	.recoBox>.reco>.detail {
		border: 2px solid transparent;

		width: 100%;
		height: 14%;
	}
	.recoBox>.reco>.detail.thumb {
		height: 70%;
	}
	.recoBox>.reco>.detail.thumb>img {
		object-fit: cover;

		height: 100%;
		max-width: 95%;
	}
	.recoBox>.reco>.detail>.icon {
		width: 14%;
	}
	.recoBox>.reco>.detail>.text {
		width: 72%;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	/*-------pageBox-------*/
	.pageBox {
		width: 100%;
		height: 5%;
	}
	.pageBox>.prev, .pageBox>.next {
		width: 33%;

		cursor: pointer;
	}
	.pageBox>.count {
		width: 33%;
	}
	.pageBox>.count>* {
		padding-top: 1px;
	}
	.pageBox>.count>input {
		width: 40px;
		padding-top: 3px;

		text-align: center;

		color: #E0E2E4;
		background-color: #293134;

		cursor: auto;
	}

	/*-------tabBox-------*/
	.tabBox {
		width: 100%;
		height: 100%;
	}

	/*-------tabBox.dash-------*/
	.tabBox.Dash>.headBox {
		width: 100%;
		height: 45px;
		box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);

		background-color: #34495e;
	}
	.tabBox.Dash>.headBox>.head {
		width: 100%;

		border: 2px solid #34495e;

		margin: 0;
		margin-right: 2px;

		color: #E0E2E4;

		cursor: pointer;
	}
	.tabBox.Dash>.headBox>.head:hover {
		border-bottom: 2px solid #148474;
	}
	.tabBox.Dash>.headBox>.head.active {
		border-radius: 4px;
		border: 2px solid #148474;
		background-color: #148474;
	}
	.tabBox.Dash>.headBox>.item {
		height: 93%;
		width: 100%;
	}
	.tabBox.Dash>.item {
		height: 100%;
		width: 100%;

		flex: 1;
	}

	/*-------wordBox-------*/
	.wordBox>.word {
		margin: 3px;

		min-width: 30px;
		height: 33px;

		border: 2px solid #557799;
		background-color: #E0E2E4;

		padding: 4px;
		padding-left: 3px;
		padding-right: 3px;

		border-radius: 4px;

		text-align: center;
		color: #557799;
		font-size: 17px;

		cursor: auto;
	}
	.wordBox>.word:focus {
		border-bottom: 2px solid #557799;
	}

	/*-------Component-------*/
	.NaviColumnSpace {
		width: 90%;
		height: 24px;
		min-height: 24px;
	}
	.NaviColumn {
		width: 90%;
		height: auto;
		min-height: 45px;
	}
	.NaviColumn2x {
		width: 90%;
		height: auto;
		min-height: 90px;
	}
	.NaviColumn3x {
		width: 90%;
		height: auto;
		min-height: 135px;
	}
	.ButtonClick {
		margin: 3px;
		min-width: 30px;

		border: 2px solid #557799;

		padding: 4px;
		padding-left: 3px;
		padding-right: 3px;

		border-radius: 4px;

		text-align: center;

		color: #E0E2E4;
		background-color: #557799;

		cursor: pointer;
	}
	.tagBox>.tags>.tag {
		border: 2px solid;
		border-radius: 2px;

		padding: 4px;
		margin: 2px;
	}

	/*-------logBox-------*/
	.logBox {
		width: 100%;
		height: 100%;

		overflow-x: hidden;
		overflow-y: hidden;
	}
	.logBox>.logs {
		display: block;

		width: 97%;
		height: 100%;

		margin-left: 3%;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.leftHeadButton {
		border: 3px solid transparent;
	}
</style>