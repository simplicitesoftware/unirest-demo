import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				'__dirname': true
			}
		},
		rules: {
			'indent': [ 'error', 'tab' ],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'no-multi-spaces': 'error',
			'no-trailing-spaces': [ 'error', { skipBlankLines: false } ],
			'no-console': 'off',
			'no-debugger': 'error'
		}
	}
];
