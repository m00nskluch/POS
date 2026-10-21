/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
			},
			colors: {
				paper: {
					50: '#FFFDF9',
					100: '#FDF8EE',
					200: '#F5E9D3',
					300: '#E8D5B5'
				}
			}
		}
	},
	plugins: []
};
