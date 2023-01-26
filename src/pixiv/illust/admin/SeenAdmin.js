import { reactive } from 'vue';



class SeenAdmin {
	states = {};
	seens = {};
	mapEL = new Map();


	intersectionObserver = new IntersectionObserver(entries => {
		entries.filter(entry => entry.isIntersecting)
			.forEach(({ target: el }) => {
				const iid = this.mapEL.get(el);

				this.seens[iid] = true;


				const state = this.states[iid];

				state.els.forEach(el => {
					this.intersectionObserver.unobserve(el);
					this.mapEL.delete(el);
				});

				state.illusts.forEach(illust => illust.isSeen = true);

				delete this.states[iid];
			});
	}, { rootMargin: '-1px 0px -1px 0px' });


	constructor(wock, profile, $post) {
		return reactive(this);
	}

	observe(illust, el) {
		const iid = illust.iid;

		if(this.seens[iid]) { return illust.isSeen = true; }

		const state = this.states[iid] ||
			(this.states[iid] = { els: [], illusts: [] });


		state.els.push(el);
		state.illusts.push(illust);

		this.mapEL.set(el, iid);


		this.intersectionObserver.observe(el);
	}

	isSeen(iid) { return this.states[iid]?.isSeen; }
}


export default SeenAdmin;
