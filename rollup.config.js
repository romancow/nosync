import pkg from './package.json'
console.log(Object.keys(pkg.dependencies))

export default [{
	input: pkg.module,
	external: ['fs-extra', 'path'],
	// context: 'window',
	output: {
		file: pkg.main,
		format: 'cjs',
	},
}, {
	input: 'es6/cli.js',
	external: ['commander'],
	output: {
		file: pkg.bin,
		format: 'cjs'
	}
}]
