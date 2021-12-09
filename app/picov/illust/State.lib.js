import { DB } from '../../../lib/global.js';

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
				state: 0,
				count: 0,
				countFetched: 0,
				sizeAll: 0,
				progress: 0,
				files: []
			}));

			this.#push[iid] ?? (this.#push[iid] = []).push(wock);
		});


		try {
			const illustsDB = await db.query('SELECT * FROM pixiv.illust WHERE id IN ($r)', [iids]);
			const files = await db.query('SELECT * FROM pixiv.file WHERE illust IN ($r)', [iids]);


			illustsDB.forEach(illustDB => {
				const illust = this.#maps[illustDB.id];

				illust.state = illustDB.stat & 2 ? 2 : (illustDB.stat & 1 ? 1 : 0);

				illust.files = illust.files = files
					.filter(file => file.illust == illustDB.id)
					.sort((a, b) => a.index - b.index)
					.map(file => { return { delay: file.delay, file: file.name }; });
			});
		}
		finally { db?.close(); }


		wock.cast('statesIllust', result);
	}
}


const statesIllust = new IllustStates();

export default statesIllust;