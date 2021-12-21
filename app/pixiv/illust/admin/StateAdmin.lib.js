import { DB, G } from '../../../lib/global.js';

class IllustStates {
	#maps = {};
	#push = {};

	async pull(iids = [], wock) {
		const db = await DB.pick();

		if(!iids?.length) { return; }

		const result = [];
		iids.forEach(iid => {
			result.push(this.#maps[iid] ?? (this.#maps[iid] = {
				iid,
				fetch: 0,
				fetched: 0,
				progMax: 0,
				prog: 0,
				files: [],
				L: '',
				R: '',
			}));

			const pushs = (this.#push[iid] ?? (this.#push[iid] = []));

			pushs.push(wock);
			wock.maresClose.push(() => {
				const index = pushs.indexOf(wock);

				if(index > -1) { pushs.splice(index, 1); }
			});
		});


		try {
			const illustsDB = await db.query('SELECT * FROM pixiv.illust WHERE id IN ($r)', iids);
			const files = await db.query('SELECT * FROM pixiv.file WHERE illust IN ($r)', iids);


			illustsDB.forEach(illustDB => {
				const state = this.#maps[illustDB.id];

				state.fetch = illustDB.fetch;

				state.files = state.files = files
					.filter(file => file.illust == illustDB.id)
					.sort((a, b) => a.index - b.index)
					.map(file => ({ delay: file.delay, file: file.name }));
			});
		}
		finally { db?.close(); }


		wock.cast('updateIllustStates', result);
	}

	push(iid, info_) {
		const info = Object.assign({ iid }, info_);

		(this.#push[iid] ?? []).forEach(wock => {
			try {
				wock.cast('updateIllustStates', [info]);
			}
			catch(e) { G.error('保存', '通知', e); }
		});
	}
}


const statesIllust = new IllustStates();

export default statesIllust;