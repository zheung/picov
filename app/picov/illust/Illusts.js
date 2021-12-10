import { computed, ref } from 'vue';
import { $get } from '../../lib/plugin/Aegis.js';


class Illusts {
	#type = ref('follow');
	#map = ref({ follow: [] });
	#page = ref({ follow: 1 });

	state = ref({});
	illusts = computed(() => this.#map.value[this.#type.value]);
	page = computed(() => this.#page.value[this.#type.value]);

	constructor(wock) {
		this.wock = wock;

		wock.add('statesIllust', states => {
			states.forEach(state => this.state.value[state.iid] = state);
		});
	}

	set type(type) { this.#type.value = type; }

	next() { this.#page.value[this.#type.value]++; }
	prev() { if(this.#page.value[this.#type.value] > 1) { this.#page.value[this.#type.value]--; } }
	jump(page) { this.#page.value[this.#type.value] = ~~page; }


	async getFollow(who, page) {
		const illusts = this.#map.value.follow = await $get('picov/illust/listFollow', { who: who.name, page });

		this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), who.name);
	}
}


export default Illusts;