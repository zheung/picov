import { computed, ref, watch } from 'vue';
import { $get } from '../../../lib/plugin/Aegis.js';
import randomString from '../../../lib/random.js';


const sFirst = Symbol('first');

class Tab {
	constructor(id, title, typeTab, icon, typeList, module) {
		this.id = id;
		this.title = title;
		this.typeTab = typeTab;
		this.icon = icon;
		this.typeList = typeList;
		this.module = module;
		this.info = {};
	}
}

class TabAdmin {
	map = ref({});

	key = ref('');
	now = computed(() => this.map.value[this.key.value]);
	list = computed(() => Object.values(this.map.value));
	params = ref([]);

	sFirst = sFirst;

	constructor(modulePre) {
		this.modulePre = modulePre;
	}


	addIcon(title, icon, type, module, ...params) {
		const id = randomString();
		const tabNew = this.map.value[id] = new Tab(id, title, 'icon', icon, type, module);

		this.change(tabNew, ...params, sFirst);

		return tabNew;
	}

	/** @param {Tab} tab */
	change(tab, ...params) {
		if(this.key.value == tab.id) { return; }

		this.key.value = tab.id;
		this.modulePre.value = tab.module;
		this.params.value = params;
	}
}



export { Tab, sFirst };
export default TabAdmin;