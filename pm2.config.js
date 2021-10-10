module.exports = {
	apps: [
		{
			version: '1.0.0',
			name: 'firestarter',
			script: 'npm',
			args: 'start',
			watch: true,
			env_development: {
				FORCE_COLOR: 3,
			},
		},
	],
};
