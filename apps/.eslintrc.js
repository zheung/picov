const rc = {
	overrides: [
		{
			files: ['*.vue', '*.js'],
			excludedFiles: ['*.api.js', 'app.js'],
			env: {
				es2020: true,
				browser: true,
			},
			extends: [
				'eslint:recommended',
				'plugin:vue/recommended'
			],
			parser: 'vue-eslint-parser',
			parserOptions: {
				parser: '@babel/eslint-parser',
				sourceType: 'module',
				requireConfigFile: false,
				babelOptions: {
					plugins: [
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-proposal-optional-chaining'
					]
				}
			},
			rules: {
				indent: [0],
				linebreakStyle: [2, 'unix'],
				quotes: [2, 'single', { allowTemplateLiterals: true }],
				semi: [2, 'always'],
				noUnusedVars: [2, { vars: 'all', args: 'after-used' }],
				noConsole: [2],
				noVar: [2],
				quoteProps: [2, 'as-needed'],
				requireAtomicUpdates: [0],

				'vue/html-indent': [2, 'tab'],
				'vue/script-indent': [2, 'tab', { baseIndent: 1 }],
				'vue/max-attributes-per-line': [0],
				'vue/mustache-interpolation-spacing': [0],
				'vue/singleline-html-element-content-newline': [0],
				'vue/no-v-html': [0],
				'vue/html-self-closing': [1, {
					html: {
						void: 'always'
					}
				}],
			},
			globals: {
				App: true,

				L: true,

				B: true,
				A: true
			}
		}
	],
};

const rules = rc.overrides[0].rules;
for(const key in rules) {
	const keyCamel = key.split(/(?=[A-Z])/).join('-').toLowerCase();
	if(keyCamel != key) {
		rules[keyCamel] = rules[key];

		delete rules[key];
	}
}

module.exports = rc;