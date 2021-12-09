import { computed, ref } from 'vue';
import { $get } from '../../lib/plugin/Aegis.js';
import { $wock } from '../../lib/plugin/Wocker/Wocker.js';


class Illusts {
	#type = ref('follow');
	#map = ref({
		follow: []
	});
	state = ref({});
	list = computed(() => this.#map.value[this.#type.value]);

	constructor() {
		$wock.add('statesIllust', (states) => {
			states.forEach(state => this.state.value[state.iid] = state);
		});
	}

	set type(type) { this.#type.value = type; }


	async getFollow(who, page) {
		const illusts = this.#map.value.follow = await $get('picov/illust/listFollow', { who: who.name, page });

		$wock.cast('picov/illust/pull', illusts.map(illust => illust.iid), who.name);
	}
}

const illusts = new Illusts();
window.IS = illusts;

export default illusts;