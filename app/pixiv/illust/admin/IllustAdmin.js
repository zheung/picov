class IllustAdmin {
	state = {};

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
				this.wock.cast('pixiv/illust/pull', illusts.map(illust => illust.iid), this.who);
			}
		});
	}


	watch(illusts) { if(illusts.length) { this.wock.cast('pixiv/illust/pull', illusts.map(illust => illust.iid), this.who); } }

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