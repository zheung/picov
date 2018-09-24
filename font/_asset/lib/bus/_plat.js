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

	bus.data.r18 = [ { name: '全部', code: 0 }, { name: '成人', code: 1 }, { name: '安全', code: 2 }, ];

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