module.exports = {
	apps: [
		{
			version: '1.0.0',
			name: 'firestarter',
			script: 'npm',
			args: 'start',
			watch: ['src'],
			ignore_watch: ['docs'],
			env_development: {
				FORCE_COLOR: 3,
			},
		},
	],
};
