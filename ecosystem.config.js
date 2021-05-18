module.exports = {
	apps: [
		{
			name: 'firestater',
			namespace: 'fs',
			script: 'npm',
			args: 'start',
			interpreter: 'none',
			node_args: ['--debug=7000'],
		},
	],
};
