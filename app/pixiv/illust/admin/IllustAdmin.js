import { computed, ref, watch } from 'vue';
import { $get } from '../../../lib/plugin/Aegis.js';


class IllustAdmin {
	#type = ref('follow');
	map = ref({ follow: { id: 'follow', illusts: [], page: 1, type: 'follow', } });

	state = ref({});
	illusts = computed(() => this.map.value[this.#type.value]?.illusts);
	page = computed(() => this.map.value[this.#type.value]?.page);

	tabs = computed(() => Object.values(this.map.value).filter(i => i.type != 'follow'));

	profile = null;
	get who() { return this.profile?.value?.name; }

	constructor(wock, profile) {
		this.wock = wock;
		this.profile = profile;

		wock.add('updateIllustStates', states =>
			states.forEach(state =>
				this.state.value[state.iid] = Object.assign(this.state.value[state.iid] ?? {}, state)
			)
		);

		wock.at('open', () => {
			const illusts = this.illusts.value;

			if(illusts.length) {
				this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), this.who);
			}
		});
	}

	set type(type) { this.#type.value = type; }
	get type() { return this.#type.value; }

	next() { this.map.value[this.#type.value].page++; }
	prev() { if(this.map.value[this.#type.value].page > 1) { this.map.value[this.#type.value].page--; } }
	jump(page) { this.map.value[this.#type.value].page = ~~page; }


	async getSearch(keyword, page) {
		const illusts = await $get('picov/illust/listSearch', { who: this.who, page, keyword });

		this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), this.who);
	}

	async search(keyword) {
		if(!keyword || !keyword.trim()) { return; }

		const illusts = await $get('picov/illust/listSearch', { who: this.who, page: 2, keyword });

		this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), this.who);

		const sid = Math.random().toFixed(8).slice(2);
		this.map.value[sid] = {
			illusts,
			type: sid,
			page: 1,
			title: `搜索：${keyword}`,
			tag: 'search',
			wathHandle: watch(this.map.value[sid].page, page => this.getSearch(page), { immediate: true })
		};

		this.type = sid;
	}

	pull(illusts) { if(illusts.length) { this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), this.who); } }
	save(illust, force = false) { this.wock.cast('picov/illust/save', illust, this.who, force); }
	async saveAll(illusts) {
		for(const illust of illusts) {
			this.save(illust);

			await new Promise(r => setTimeout(() => r(), 147));
		}
	}
}


export default IllustAdmin;