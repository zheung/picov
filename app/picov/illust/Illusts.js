import { computed, ref } from 'vue';
import { $get } from '../../lib/plugin/Aegis.js';

class Illusts {
	#type = ref('follow');
	#map = ref({
		follow: []
	});

	list = computed(() => this.#map.value[this.#type.value]);

	set type(type) { this.#type.value = type; }


	async getFollow(who, page) {
		this.#map.value.follow = await $get('picov/illust/listFollow', { who: who.name, page });
	}


}


const illusts = new Illusts();

export default illusts;