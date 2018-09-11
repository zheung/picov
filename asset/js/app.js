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

		psub: 1,

		tags: [],

		logs: [],
		logDict: { CountProc: { text: '下载中的作品： 0', color: '#557799' } },
		logHide: false
	},
	methods: {
		turn: function (page, offset) {
			if(this.psub == 1 && this.records.length > 20 && offset == 1)
				this.psub = 2;
			else if(this.psub == 2 && offset == -1)
				this.psub = 1;
			else if(page+offset > 0)
				this.io.emit(this.meanNow, this.params(page+offset, this.meanNow));
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
			var src = this.src;

			if(!/fr=/.test(src)) {
				this.src = src.replace(/\?/, '?fr=1&');
			}
		},
		clear: function() {
			this.logs = [];
			this.logDict = { CountProc: this.logDict.CountProc };
		},
		downloadAll: function() {
			var self = this;

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
	mounted: function() {
		window.keyInit();
	}
});

app.turn(0, 1);
app.io.emit('listTag');