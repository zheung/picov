module.exports = async function(dbinfo, G) {
	let connect;

	if(!connect) {
		connect = await require('mongodb').MongoClient.connect(
			`mongodb://${dbinfo.user}:${dbinfo.pswd}@${dbinfo.dest}:${dbinfo.port}/${dbinfo.name}`, {
				useNewUrlParser: true
			});

		delete dbinfo.user;
		delete dbinfo.pswd;
		delete dbinfo.dest;
		delete dbinfo.port;
	}

	let db = connect.db(dbinfo.name);
	delete dbinfo.name;

	let funcDict = {};
	let collDict = {};

	return {
		coll: function(collName) {
			if(funcDict[collName]) {
				return funcDict[collName];
			}
			else {
				return funcDict[collName] = (function(coll) {
					return {
						coll,
						find: async function(query) {
							return coll.find(query);
						},
						drop: async function() {
							return await coll.drop();
						},
						insert: async function(arr) {
							return await coll.insertMany(arr);
						},
						renew: async function(arr) {
							try {
								await coll.drop();
							}
							catch(e) {
								if(e.code != 26) G.error(e);
							}

							return await coll.insertMany(arr);
						},
					// Only for Project Picov
						getStat: async function(recos) {
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
						getStatByIds: async function(ids) {
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
						getStatOne: async function(iid) {
							let result = await coll.find(
								{ iid: ~~iid },
								{ projection: { iid: 1, down: 1, ding: 1 } }
							)
								.toArray();

							return result[0] || { iid: ~~iid };
						},
						updateOne: async function(iilust) {
							let result;

							delete iilust._id;

							result = await coll.updateOne({ iid: iilust.iid }, { $set: iilust });

							if(!result.matchedCount)
								result = await coll.insertOne(iilust);

							return !!result.modifiedCount || !!result.insertedCount;
						}
					};
				})(collDict[collName] || (collDict[collName] = db.collection(collName)));
			}
		}
	};
};