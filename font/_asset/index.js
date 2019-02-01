// import 'babel-polyfill';

import Vue from 'Vue';
Vue.config.debug = true;
window.Vue = Vue;

import pubInit from './pub';
import libInit from './lib';

import cenInit from './center';

import './css/index.css';
import './css/extend.css';

let main = async function() {
	pubInit();

	let { Loader } = libInit();

	cenInit();

	try {
		BUS.module = [{
			'name': '图片中心',
			'show': true,
			'list': [{
				'type': 'listFollow',
				'name': '关注图片',
				'only': true,
				'show': true
			}, {
				'type': 'listSearch',
				'name': '搜索图片',
				'only': false,
				'show': true
			}, {
				'type': 'listAuthor',
				'name': '作者',
				'only': false,
				'show': false
			}, {
				'type': 'listNumber',
				'name': '数字',
				'only': false,
				'show': false
			}, {
				'type': 'viewIllust',
				'name': '动图播放',
				'only': false,
				'show': false
			}]
		}];

		BUS.homeType = 'listFollow';
	}
	catch (error) { true; }

	window.app = new Vue({
		el: '#home',
		data: {
			B: window.BUS,

			views: [],
		},
		created: async function() {
			BUS.app = this;
		},
		computed: {
			frameBoxClass: function() {
				let { B } = this;

				let result = {
					frameBox: true,
					mini: X.comp('homeLeft') && X.comp('homeLeft').pinned && X.comp('homeLeft').expandFocus,

					trans: true
				};

				result['sub'+B.viewNow] = true;

				return result;
			}
		},
		methods: {
			findTab: function(type) {
				for(let group of BUS.module) {
					for(let modl of group.list) {
						if(modl.type == type) {
							return modl;
						}
					}
				}
			},
			changeTab: async function(modl) {
				let { type, name, only, base, time } = modl;
				let views = X.comp('homeNavi').views;

				let tab;

				if(base) {
					await this.setViewNow(base, time, only);
				}
				else {
					time = time || 0;

					if(!time || !only) {
						time++;

						await Loader(type, time);

						modl.time = time;

						await this.setViewNow(type, time, only);

						views.push(tab = { type: `${type}_${time}`, name, only, base: type, time });
					}
					else if(only) {
						if(time) {
							let onNavi = false;

							for(let view of views) {
								if(view.base == type && view.time == time) {
									tab = view;

									onNavi = true;
								}
							}

							if(!onNavi) {
								views.push(tab = { type: `${type}_${time}`, name, only, base: type, time });
							}
						}

						await this.setViewNow(type, time, only);
					}
				}

				return tab;
			},
			closeTab: async function(madule) {
				let views = X.comp('homeNavi').views;

				let index = views.indexOf(madule);
				views.splice(index, 1);

				if(views.length == index) {
					index -= 1;
				}

				let now = views[index];

				await this.setViewNow(now.base, now.time);
			},
			setViewNow: async function(typeNow, time, only) {
				let { B } = this;

				let comp = time ? `${typeNow}_${time}` : typeNow;

				let typeOld = B.viewNow.split(/^([a-zA-Z0-9_]+)_(\d+)$/)[1];

				if(typeNow && typeOld && typeNow != typeOld) {
					Vue.set(B, 'viewNow', comp);

					if(only) {
						window.location.hash = `#${typeNow}`;
					}
				}
				else {
					Vue.set(B, 'viewNow', 'empty');

					this.$nextTick(function() {
						Vue.set(B, 'viewNow', comp);

						if(only) {
							window.location.hash = `#${typeNow}`;
						}
						else {
							window.location.hash = '';
						}
					}.bind(this));
				}
			},

			changeSearch: async function(query) {
				let modl = this.findTab('listSearch');

				let tab = await this.changeTab(modl);

				tab.name = '搜索: ' + (query.title || query.word);

				X.stat(`listSearch_${tab.time}`).data = query;
				X.stat(`listSearch_${tab.time}`).tab = tab;
			},
			changeAuthor: async function(uid, user) {
				let modl = this.findTab('listAuthor');

				if(modl.time) {
					let views = X.comp('homeNavi').views;
					let dict = X.comp('listAuthor').dict;

					for(let view of views) {
						if(view.base == 'listAuthor' && dict[view.time] == uid) {
							this.changeTab(view);

							return;
						}
					}
				}

				let tab = await this.changeTab(modl);
				tab.name = '作者: ' + user;

				X.comp('listAuthor').dict[tab.time] = uid;

				X.stat(`listAuthor_${tab.time}`).tab = tab;

				X.stat(`listAuthor_${tab.time}`).uid = uid;
				X.stat(`listAuthor_${tab.time}`).user = user;
			},
			changeNumber: async function(id) {
				let modl = this.findTab('listNumber');

				if(modl.time) {
					let views = X.comp('homeNavi').views;
					let dict = X.comp('listNumber').dict;

					for(let view of views) {
						if(view.base == 'listNumber' && dict[view.time] == id) {
							this.changeTab(view);

							return;
						}
					}
				}

				let tab = await this.changeTab(modl);
				tab.name = '数字: ' + id;

				X.comp('listNumber').dict[tab.time] = id;

				X.stat(`listNumber_${tab.time}`).tab = tab;

				X.stat(`listNumber_${tab.time}`).id = id;
			},
			changeViewer: async function(illust) {
				let modl = this.findTab('viewIllust');

				if(modl.time) {
					let views = X.comp('homeNavi').views;
					let dict = X.comp('viewIllust').dict;

					for(let view of views) {
						if(view.base == 'viewIllust' && dict[view.time] == illust.iid) {
							this.changeTab(view);

							return;
						}
					}
				}

				let tab = await this.changeTab(modl);
				tab.name = '动图: ' + (illust.title || illust.iid);

				X.comp('viewIllust').dict[tab.time] = illust.iid;

				X.stat(`viewIllust_${tab.time}`).tab = tab;

				X.stat(`viewIllust_${tab.time}`).illust = illust;
			}
		},
		mounted: async function() {
			this.B.findTab = this.findTab;
			this.B.changeTab = this.changeTab;
			this.B.closeTab = this.closeTab;

			this.B.changeSearch = this.changeSearch;
			this.B.changeAuthor = this.changeAuthor;
			this.B.changeViewer = this.changeViewer;
			this.B.changeNumber = this.changeNumber;
		}
	});
};

window.onload = function() { main(); };
// window.onpopstate = function() { L(window.location.hash); };