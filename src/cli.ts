#! /usr/bin/env node

const { version } = require('../package.json')
import program from 'commander'
// import nosync from '../'

program.version(version)
	.option('-s, --settings <json file>', 'JSON settings file')
	.option('-b, --base <path>', 'Base folder to store non-synced files')
	.option('-o, --overwrite', 'Overwrite existing files in nosync folder')
	.arguments('<paths...>')	//"Files or folders you don't want synced")
	.action((paths: string[]) => {

	})
	.parse(process.argv)
