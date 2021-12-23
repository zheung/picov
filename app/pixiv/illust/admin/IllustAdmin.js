import { reactive } from 'vue';


class IllustAdmin {
	state = {};
	get stateProxy() { return this.ref?.value?.state; }

	iids = new Set();

	profile = null;
	get who() { return this.profile?.name; }


	constructor(wock, profile, $get) {
		this.wock = wock;
		this.profile = profile;
		this.$get = $get;

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

		return illusts;
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

		return `${countFetched}/${countAll}`;
	}

	async fetchFollow(page, isWatch = true) {
		const illusts = await this.$get('pixiv/illust/list/follow', { who: this.who, page }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
	async fetchIllusts(iids, isWatch = true) {
		const illusts = await this.$get('pixiv/illust/list/illust', { who: this.who, iids }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
	async fetchSearch(keyword, page, isWatch = true) {
		const illusts = await this.$get('pixiv/illust/list/search', { who: this.who, keyword, page }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
	async fetchUser(uid, isWatch = true) {
		const illusts = await this.$get('pixiv/illust/list/user', { who: this.who, uid }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
}


export default IllustAdmin;