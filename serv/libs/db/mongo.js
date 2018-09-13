module.exports = async(dbinfo) => {
	let connect;

	if(!connect) {
		connect = await require('mongodb').MongoClient.connect(`mongodb://${dbinfo.user}:${dbinfo.pswd}@${dbinfo.dest}:${dbinfo.port}/${dbinfo.name}`);

		delete dbinfo.user;
		delete dbinfo.pswd;
		delete dbinfo.dest;
		delete dbinfo.port;
	}

	let db = connect.db(dbinfo.name);
	delete dbinfo.name;

	return {
		coll: function(collname) {
			let coll = db.collection(collname);

			return {
				find: async(query) => {
					return coll.find(query);
				},
				drop: async() => {
					return await coll.drop();
				},
				insert: async(arr) => {
					return await coll.insertMany(arr);
				},
				renew: async(arr) => {
					try {
						await coll.drop();
					}
					catch(e) {
						if(e.code != 26) LE(e);
					}

					return await coll.insertMany(arr);
				},
			// Only for Project Picov
				getStat: async(recos) => {
					let arr = [];

					for(let reco of recos) {
						arr.push(~~reco.iid);
					}

					let raw = await coll.find(
						{ iid: { $in: arr } },
						{ projection: { iid: 1, down: 1, ding: 1 } }
					).toArray();

					let result = {};

					for(let r of raw)
						result[r.iid] = r;

					return result;
				},
				getStatByIds: async(ids) => {
					let raw = await coll.find(
						{ iid: { $in: ids } },
						{ projection: { iid: 1, down: 1, ding: 1 } }
					)
						.toArray();

					let result = {};

					for(let r of raw)
						result[r.iid] = r;

					return result;
				},
				getStatOne: async(iid) => {
					let result = await coll.find(
						{ iid: ~~iid },
						{ projection: { iid: 1, down: 1, ding: 1 } }
					)
						.toArray();

					return result[0] || { iid: ~~iid };
				},
				updateOne: async(iilust) => {
					let result;

					result = await coll.updateOne({ iid: iilust.iid }, { $set: iilust });

					if(!result.matchedCount)
						result = await coll.insertOne(iilust);

					return !!result.modifiedCount || !!result.insertedCount;
				}
			};
		}
	};
};