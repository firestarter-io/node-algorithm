module.exports = {
	root: true,
	env: {
		node: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:import/warnings',
	],
	rules: {
		'@typescript-eslint/ban-ts-comment': [0],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				ignoreRestSiblings: true,
				argsIgnorePattern: '^_',
			},
		],
		'no-unused-vars': [0],
		'import/order': [
			'error',
			{
				pathGroups: [
					{
						pattern: '~/**',
						group: 'builtin',
						position: 'after',
					},
				],
				groups: [
					'builtin',
					'external',
					'internal',
					'unknown',
					'parent',
					'sibling',
					'index',
					'object',
					'type',
				],
			},
		],
	},
};
