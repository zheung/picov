import { computed, ref } from 'vue';
import { $get } from '../../lib/plugin/Aegis.js';


class Illusts {
	#type = ref('follow');
	#map = ref({ follow: { illusts: [], page: 1 } });

	state = ref({});
	illusts = computed(() => this.#map.value[this.#type.value]?.illusts);
	page = computed(() => this.#map.value[this.#type.value]?.page);

	tabs = computed(() => {
		return Object.entries(this.#map.value).map(([type, is]) => 1);
	});

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

		wock.at('open', () =>
			this.wock.cast('picov/illust/pull', this.illusts.value.map(illust => illust.iid), this.who)
		);
	}

	set type(type) { this.#type.value = type; }

	next() { this.#map.value[this.#type.value].page++; }
	prev() { if(this.#map.value[this.#type.value].page > 1) { this.#map.value[this.#type.value].page--; } }
	jump(page) { this.#map.value[this.#type.value].page = ~~page; }


	async getFollow(page) {
		const illusts = this.#map.value.follow.illusts = await $get('picov/illust/listFollow', { who: this.who, page });

		this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), this.who);
	}

	async search(keyword) {
		if(!keyword || !keyword.trim()) { return; }

		const illusts = await $get('picov/illust/listFollow', { who: this.who, page: 2, keyword });

		this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), this.who);

		const sid = Math.random().toFixed(8).slice(2);
		this.#map[sid] = {
			illusts,
			page: 1,
			type: 'search',
		};

		this.type = sid;
	}
}


export default Illusts;