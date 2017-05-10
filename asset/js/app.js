window.app = new Vue({
	el: '#app',
	data: {
		io: io(),
		list: [],
		pageNow: 0,
		tabRightNavi: 1
	},
	methods: {
		pageTurn: function (page) {
			app.io.emit('listFollow', { p: page });
		}
	}
});