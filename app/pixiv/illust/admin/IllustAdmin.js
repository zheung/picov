import { reactive } from 'vue';


class IllustAdmin {
	state = {};
	iids = new Set();


	get who() { return this.profile?.name; }


	constructor(wock, profile, $get, $post) {
		this.wock = wock;
		this.profile = profile;
		this.$get = $get;
		this.$post = $post;

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
			const iids = illusts
				.map(illust => illust.iid)
				.filter(iid => !this.state[iid]);

			this.wock.cast('pixiv/illust/watch', iids, this.who);
			iids.forEach(iid => this.iids.add(iid));
		}

		return illusts;
	}

	save(illust, force = false) { this.wock.cast('pixiv/illust/save', illust, this.who, force); }
	async saveAll(illusts) {
		for(const illust of illusts.filter(illust => this.state[illust.iid]?.fetch == 0)) {
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
		const illusts = (await this.$get('pixiv/illust/list/illust', { who: this.who, iids }))?.reverse() ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
	async fetchSearch(keyword, page, mode, modeSearch, type, isWatch = true) {
		const { illusts, total } = await this.$get('pixiv/illust/list/search', { who: this.who, keyword, page, mode, modeSearch, type }) ?? [];

		return { illusts: isWatch ? this.watch(illusts) : illusts, total };
	}
	async fetchUser(uid, isWatch = true) {
		const illusts = await this.$get('pixiv/illust/list/user', { who: this.who, uid }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}

	async getLocalIllusts(iids, isWatch = true) {
		const illusts = await this.$get('local/illust/list', { who: this.who, iids }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
	async getLocalUgoira(isWatch = true) {
		const illusts = await this.$get('local/illust/ugoira/new', { who: this.who }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
	async getLocalGallery(isWatch = true) {
		const illusts = await this.$get('local/illust/list-new', { who: this.who }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}
	async getLocalGallerySaved(isWatch = true) {
		const illusts = await this.$get('local/illust/list-saved', { who: this.who }) ?? [];

		return isWatch ? this.watch(illusts) : illusts;
	}

	async keepUgoira(iid) { return this.$post('local/illust/ugoira/keep', { who: this.who, iid }); }
	async deleteUgoira(iid) { return this.$post('local/illust/ugoira/delete', { who: this.who, iid }); }
	async keepFile(file) { return this.$post('local/illust/keep', { who: this.who, file }); }
	async deleteFile(file) { return this.$post('local/illust/delete', { who: this.who, file }); }
	async deleteFileBatch(files) { return this.$post('local/illust/delete-batch', { who: this.who, files }); }
}


export default IllustAdmin;
