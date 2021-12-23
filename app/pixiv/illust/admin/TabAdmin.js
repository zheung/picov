import { reactive } from 'vue';
import randomString from '../../../lib/random.js';


const sInitTab = Symbol('initTab');

class Tab {
	constructor(id, title, typeTab, icon, typeList, module) {
		this.id = id;
		this.title = title;
		this.typeTab = typeTab;
		this.icon = icon;
		this.typeList = typeList;
		this.module = module;
		this.info = { illustsNow: [], params: {}, paramsPre: {} };
	}
}

class TabAdmin {
	sInitTab = sInitTab;

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

		this.change(tabNew, ...params, sInitTab);

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
		this.modulePre = tab.module;
		this.params = params;
	}
}



export { Tab, sInitTab };
export default TabAdmin;