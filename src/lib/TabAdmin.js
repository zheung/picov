import { reactive } from 'vue';
import randomString from './random.js';



class Tab {
	constructor(id, title, typeTab, icon, typeList, module, isHidden, isOnce, params) {
		this.id = id;
		this.title = title;
		this.typeTab = typeTab;
		this.icon = icon;
		this.typeList = typeList;
		this.module = module;
		this.info = { illustsNow: [], params: {}, paramsPre: {} };
		this.isHidden = isHidden ?? false;
		this.isOnce = isOnce ?? false;
		this.params = params ?? {};
	}
}

class TabAdmin {
	map = {};
	key = '';

	params = [];

	histories = [];

	/** @type {Tab} */
	get now() { return this.map[this.key]; }
	get list() { return Object.values(this.map); }


	constructor(modulePre) {
		this.modulePre = modulePre;

		return reactive(this);
	}


	addIcon(title, icon, type_, module, ...params) {
		const id = randomString();

		const [type, ...extras] = type_.split('|');

		const isOnce = extras.includes('once');
		const isHidden = extras.includes('hidden');

		const tab =
			(isOnce ? Object.values(this.map).find(t => t.typeList == type) : undefined) ||
			(this.map[id] = new Tab(id, title, 'icon', icon, type, module, isHidden, isOnce));


		if(tab) { this.change(tab, ...params); }

		return tab;
	}

	del(tab) {
		const now = this.now;

		const map = this.map;
		const ids = Object.keys(map);
		const index = ids.indexOf(tab.id);

		delete this.map[tab.id];


		if(now === tab) {
			this.histories.pop();
			const tabLast = this.histories.pop();

			if(tabLast) {
				this.change(tabLast);
			}
			else {
				this.change(map[ids[index + 1] ?? ids[index - 1]]);
			}
		}

		this.histories = this.histories
			.filter(his => his !== tab)
			.filter((his, index, arr) => his !== arr[index - 1]);
	}

	/** @param {Tab} tab */
	change(tab, ...params) {
		if(this.key == tab.id && !tab.isOnce) { return; }

		this.key = tab.id;
		tab.params = params;
		this.modulePre = tab.module;

		if(this.histories[this.histories.length - 1] !== tab) { this.histories.push(tab); }

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
