/*eslint-env node, es6*/

module.exports = function(api) {
	api.cache(true);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
					targets: process.env.npm_lifecycle_event == 'prod' ? {
						chrome: '41',
					} : {
						chrome: '69',
					},
					useBuiltIns: 'usage',
					corejs: 3
				}
			]
		]
	};
};