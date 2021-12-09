const spacing = 0.25;
const unit = 'rem';
const space = time => `${time * spacing}${unit}`;
const plugin = require('tailwindcss/plugin');

module.exports = {
	purge: ['./app/index.html', './app/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			spacing: {
				42: space(42),
			},
			width: {
				17: space(17),
				80: space(80),
			},
			height: {
				78: space(78),
			},
			maxHeight: {
				29: space(29),
			},
		},
		boxShadow: {
			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
			DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
			'3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
			inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
			none: 'none',

			mdd: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
		},
	},
	variants: {
		extend: {
			contrast: ['hover'],
			fontWeight: ['hover', 'focus'],
			fontBold: ['hover', 'focus'],
			backgroundColor: ['checked'],
			borderColor: ['checked'],
			lineHeight: ['responsive'],
			width: ['responsive'],
			brightness: ['hover', 'focus']
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				'.inblock': { display: 'inline-block', 'vertical-align': 'top' },
				'.elli': { overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' },
				'.text-snow': { color: 'snow' },
			}, { variants: ['responsive', 'hover'] });
		}),
	]
};
