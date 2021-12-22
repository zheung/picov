import { reactive } from 'vue';


class IllustAdmin {
	state = {};
	get stateProxy() { return this.ref?.value?.state; }

	iids = new Set();

	profile = null;
	get who() { return this.profile?.name; }




	constructor(wock, profile) {
		this.wock = wock;
		this.profile = profile;

		return reactive(this);
	}

	init() {
		this.wock.add('updateIllustStates', states =>
			states.forEach(state =>
				this.state[state.iid] = Object.assign(this.state[state.iid] ?? {}, state)
			)
		);

		this.wock.at('open', () => {
			if(this.iids.size) {
				this.wock.cast('pixiv/illust/watch', [...this.iids], this.who);
			}
		});

		return this;
	}


	watch(illusts) {
		if(illusts.length) {
			const iids = illusts.map(illust => illust.iid);
			this.wock.cast('pixiv/illust/watch', iids, this.who);
			iids.forEach(iid => this.iids.add(iid));
		}
	}

	save(illust, force = false) { this.wock.cast('pixiv/illust/save', illust, this.who, force); }
	async saveAll(illusts) {
		for(const illust of illusts) {
			this.save(illust);

			await new Promise(r => setTimeout(() => r(), 147));
		}
	}

	count(illusts) {
		const state = this.state;

		const countAll = illusts.reduce((acc, illust) => acc + illust.count, 0);

		const iids = illusts.map(i => i.iid);
		const states = iids.map(iid => state[iid]).filter(i => i);

		const countFetched = states.reduce((acc, state) => acc + (state.fetch == 1
			? (illusts.find(i => i.iid == state.iid).count ?? 0)
			: (state.fetched ?? 0)
		), 0);

		return [countAll, countFetched];
	}
	countText(illusts) {
		const [countAll, countFetched] = this.count(illusts);

		return `${countAll} (${countAll - countFetched})`;
	}
}


export default IllustAdmin;