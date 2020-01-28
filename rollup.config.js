import pkg from './package.json'
import consts from 'rollup-plugin-consts'
import executable from 'rollup-plugin-executable'

export default [{
	input: pkg.module,
	external: ['fs-extra', 'os', 'path'],
	output: {
		file: pkg.main,
		format: 'cjs',
	}
}, {
	input: 'es6/cli.js',
	external: ['commander', 'fs-extra', 'os', 'path', '.'],
	context: 'global',
	output: {
		file: pkg.bin,
		format: 'cjs',
		banner: '#!/usr/bin/env node'
	},
	plugins: [
		consts({ version: pkg.version }),
		executable()
	]
}]
