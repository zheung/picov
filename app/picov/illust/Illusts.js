import { computed, ref } from 'vue';
import { $get } from '../../lib/plugin/Aegis.js';


class Illusts {
	#type = ref('follow');
	#map = ref({ follow: [] });
	#page = ref({ follow: 1 });

	state = ref({});
	illusts = computed(() => this.#map.value[this.#type.value]);
	page = computed(() => this.#page.value[this.#type.value]);

	profile = null;

	constructor(wock, profile) {
		this.wock = wock;
		this.profile = profile;

		wock.add('updateIllustStates', states =>
			states.forEach(state =>
				this.state.value[state.iid] = Object.assign(this.state.value[state.iid] ?? {}, state)
			)
		);

		wock.at('open', () =>
			this.wock.cast('picov/illust/pull', this.illusts.value.map(illust => illust.iid), this.profile.value.name)
		);
	}

	set type(type) { this.#type.value = type; }

	next() { this.#page.value[this.#type.value]++; }
	prev() { if(this.#page.value[this.#type.value] > 1) { this.#page.value[this.#type.value]--; } }
	jump(page) { this.#page.value[this.#type.value] = ~~page; }


	async getFollow(page) {
		const illusts = this.#map.value.follow = await $get('picov/illust/listFollow', { who: this.profile.value.name, page });

		this.wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), this.profile.value.name);
	}
}


export default Illusts;