export default function(bus, x) {
	bus.homeType = '';
	bus.viewNow = '';
	bus.dashNow = '';

	bus.user = {};

	bus.module = {};
	bus.device = {};

	bus.data.hyphen = [ { code: '', name: ' - ' }];
	bus.data.hyphen0 = [ { code: 0, name: ' - ' }];
	bus.data.yesnoList = [ { name: '是', code: 1 }, { name: '否', code: 0 }, ];

	bus.data.mode = [ { name: '全部', code: 'all' }, { name: '成人', code: 'r18' }, { name: '安全', code: 'safe' }, ];
	bus.data.smode = [
		{ name: '标签/标题/简介', code: 's_tag_tc' },
		{ name: '标签', code: 's_tag' },
		{ name: '标题/简介', code: 's_tc' },
		{ name: '标签(完全一致)', code: 's_tag_full' }
	];
	bus.data.itype = [
		{ name: '全部', code: 'all' },
		{ name: '插画', code: 'illust' },
		{ name: '漫画', code: 'manga' },
		{ name: '动图', code: 'ugoira' },
	];

	bus.changeTab = null;
	bus.changeSearch = null;
	bus.findTab = null;
	bus.closeTab = null;

	x.modl = function(type) {
		let ms = BUS.module;

		for(let group of ms) {
			for(let modl of group.list) {
				if(type == modl.type || ~~type == modl.id) {
					return modl;
				}
			}
		}
	};
}