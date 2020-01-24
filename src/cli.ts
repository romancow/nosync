import version from 'consts:version'
import program from 'commander'
import fs from 'fs-extra'
import nosync from '.'

program.version(version)
	.option('-s, --settings <json file>', 'JSON settings file')
	.option('-b, --base <path>', 'Base folder to store non-synced files')
	.option('-o, --overwrite', 'Overwrite existing files in nosync folder')
	.arguments('<paths...>')	//"Files or folders you don't want synced"
	.action((paths: string[]) => {
		const settings = program.settings as string | undefined
		const options = ((settings != null) && fs.existsSync(settings)) ?
			fs.readJsonSync(settings) :
			program.opts()
		nosync(paths, options)
	})
	.parse(process.argv)
