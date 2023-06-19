module.exports = {
	root: true,

	parser: '@typescript-eslint/parser',

	parserOptions: {
		parser: '@typescript-eslint/parser',
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},

	ignorePatterns: ['.eslintrc.cjs'],

	env: {
		node: true,
		jest: true,
	},

	extends: ['vyce/ts-node'],

	plugins: ['filenames'],

	rules: {
		'filenames/match-exported': ['error', 'kebab'],
		'import/no-extraneous-dependencies': 'off',
		'no-console': 'off',
	},
};
