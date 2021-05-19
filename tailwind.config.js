const colors = require('tailwindcss/colors')

module.exports = {
	purge: ['./index.html', './src/**/*.{js}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		fontFamily: {
			'default': ['Segoe UI'],
			'alternative': ['Open Sans'],
		},
		boxShadow: {
	        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
	        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
	        md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
	        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		},
		extend: {
			colors: {
				lime: colors.lime,
			}
		}
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
