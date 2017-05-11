window.app = new Vue({
	el: '#app',
	data: {
		io: io(),

		tabDash: 1,

		pageNow: 0,
		meanNow: 'listFollow',
		wordNow: '',
		r18Now: true,

		records: [],
		pageMean: '',

		tags: [],

		logs: [],
		logDict: { CountProc: { text: '下载中的作品： 0', color: '#557799' } }
	},
	methods: {
		turn: function (page) {
			if(page > 0)
				this.io.emit(this.meanNow, this.params(page, this.meanNow));
		},
		search: function(word) {
			this.wordNow = typeof word == 'string' ? word : this.wordNow;

			this.meanNow = 'listSearch';

			this.turn(1);
		},
		pageFollow: function() {
			this.meanNow = 'listFollow';
			this.wordNow = '';

			this.turn(1);
		},
		pageTurn:function() {
			this.turn(~~this.pageNow);

			Vue.nextTick(function() {
				this.$refs.pager.blur();
			}, this);
		},
		params: function(page, mean) {

			if(mean == 'listFollow')
				return {
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
				this.io.emit('save', { iid: reco.iid, time: reco.time });
		},
		imgError: function() {
			var src = this.src;

			if(!/fr=/.test(src)) {
				this.src = src.replace(/\?/, '?fr=1&');
			}
		},
		clear: function() {
			this.logs = [];
			this.logDict = { CountProc: this.logDict.CountProc };
		}
	},
	mounted: function() {
		window.keyInit();
	}
});

app.turn(1);
app.io.emit('listTag');