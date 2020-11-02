const Desire = require('desire');

(async function() {
	const confServ = await require('./config.server')();

	const optionDesire = {

		before: [
			require('./libs/middle/parseRaw'),
		],
		after: [],
		routs: [],
		wock: {
			after: [
				require('./libs/middle/wock/wrapResult')
			]
		}
	};

	// require('./libs/route')($, $.RoutMap.routs);

	Desire(confServ, optionDesire);
}());
