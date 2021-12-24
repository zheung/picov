import { reactive } from 'vue';
import randomString from '../../../lib/random.js';


class Tab {
	constructor(id, title, typeTab, icon, typeList, module, params) {
		this.id = id;
		this.title = title;
		this.typeTab = typeTab;
		this.icon = icon;
		this.typeList = typeList;
		this.module = module;
		this.info = { illustsNow: [], params: {}, paramsPre: {} };
		this.params = params ?? {};
	}
}

class TabAdmin {
	map = {};
	key = '';

	params = [];

	/** @type {Tab} */
	get now() { return this.map[this.key]; }
	get list() { return Object.values(this.map); }


	constructor(modulePre) {
		this.modulePre = modulePre;

		return reactive(this);
	}


	addIcon(title, icon, type, module, ...params) {
		const id = randomString();
		const tabNew = this.map[id] = new Tab(id, title, 'icon', icon, type, module);

		this.change(tabNew, ...params);

		return tabNew;
	}

	del(tab) {
		const map = this.map;
		const ids = Object.keys(map);
		const index = ids.indexOf(tab.id);

		delete this.map[tab.id];

		this.change(map[ids[index + 1] ?? ids[index - 1]]);
	}

	/** @param {Tab} tab */
	change(tab, ...params) {
		if(this.key == tab.id) { return; }

		this.key = tab.id;
		tab.params = params;
		this.modulePre = tab.module;

		this.emitChange();
	}

	emitChange() {
		(this.changers[this.now.typeList] ?? [])
			.forEach(changer => {
				try {
					changer(this.now);
				}
				catch(error) { void 0; }
			});
	}

	changers = {};
	addChanger(type, func) { (this.changers[type] ?? (this.changers[type] = [])).push(func); }
}



export { Tab };
export default TabAdmin;