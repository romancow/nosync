import * as fs from 'fs-extra'
import * as path from 'path'
import * as utils from './utilities'
import { PathMap, NoSyncOptions } from './options'

function nosync(paths: string, options?: NoSyncOptions): void
function nosync(paths: string[], options?: NoSyncOptions): void
function nosync(paths: PathMap, options?: NoSyncOptions): void
function nosync(paths: string | string[] | PathMap, options: NoSyncOptions = {}) {
	const { base = './.nosync', check = false, overwrite = false } = options
	const normalizedPaths = PathMap.normalizePaths(paths)
	utils.Object.forEach(normalizedPaths, (dest, link: string) => {
		if (check && !utils.Path.isiCloud(link)) {
			console.log("Skipping non-iCloud path:", link)
			return
		}
		const nosyncPath = path.join(base, dest)
		if (fs.existsSync(link))
			fs.moveSync(link, nosyncPath, { overwrite })
		else if (!fs.existsSync(nosyncPath))
			fs.ensureDirSync(nosyncPath)
		fs.ensureSymlinkSync(nosyncPath, link)
	})
}

export default nosync
