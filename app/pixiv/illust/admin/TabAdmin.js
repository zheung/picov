import { computed, ref } from 'vue';
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
	map = ref({});

	key = ref('');
	/** @type {import('vue').ComputedRef<Tab>} */
	now = computed(() => this.map.value[this.key.value]);
	list = computed(() => Object.values(this.map.value));
	params = ref([]);

	sInitTab = sInitTab;

	constructor(modulePre) {
		this.modulePre = modulePre;
	}


	addIcon(title, icon, type, module, ...params) {
		const id = randomString();
		const tabNew = this.map.value[id] = new Tab(id, title, 'icon', icon, type, module);

		this.change(tabNew, ...params, sInitTab);

		return tabNew;
	}

	del(tab) {
		const map = this.map.value;
		const ids = Object.keys(map);
		const index = ids.indexOf(tab.id);

		delete this.map.value[tab.id];

		this.change(map[ids[index + 1] ?? ids[index - 1]]);
	}

	/** @param {Tab} tab */
	change(tab, ...params) {
		if(this.key.value == tab.id) { return; }

		this.key.value = tab.id;
		this.modulePre.value = tab.module;
		this.params.value = params;
	}
}



export { Tab, sInitTab };
export default TabAdmin;