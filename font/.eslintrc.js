const rc = {
	env: {
		es2020: true,
		browser: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/recommended'
	],
	parserOptions: {
		sourceType: 'module'
	},
	rules: {
		indent: [2, 'tab', { ignoreComments: true, SwitchCase: 1 }],
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
	overrides: [
		{
			files: ['*.vue'],
			rules: {
				indent: [0]
			}
		}
	],
	globals: {
		Vue: true,
		App: true,

		L: true,

		B: true,

		A: true
	}
};

for(const key in rc.rules) {
	const keyCamel = key.split(/(?=[A-Z])/).join('-').toLowerCase();
	if(keyCamel != key) {
		rc.rules[keyCamel] = rc.rules[key];

		delete rc.rules[key];
	}
}

module.exports = rc;