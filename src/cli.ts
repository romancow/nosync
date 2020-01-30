import version from 'consts:version'
import program from 'commander'
import { PathMap } from './options'
import nosync from '.'

program.version(version)
	.option('-b, --base <path>', 'Base folder to store non-synced files')
	.option('-c, --check', 'Check that files are in iCloud folder')
	.option('-o, --overwrite', 'Overwrite existing files in nosync folder')
	.option('-p, --paths <json file>', 'JSON file with paths to not sync')
	.option('-s, --silent', "Suppress console information")
	.arguments('[paths...]')	//"Files or folders you don't want synced"
	.action((paths: string[]) => {
		const { paths: jsonFile, silent, ...options } = program.opts()
		if (!silent) options.log = console.log
		const jsonPaths = PathMap.fromJson(jsonFile)
		if (paths.length)
			nosync(paths, options)
		if (jsonPaths)
			nosync(jsonPaths, options)
	})
	.parse(process.argv)
