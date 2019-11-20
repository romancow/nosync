import * as fs from 'fs-extra'
import * as path from 'path'
import * as utils from './utilities'

export type NoSyncOptions = {
	base?: string
	overwrite?: boolean
}

type FolderMap = { [path: string]: string }

function nosync(folder: string, options?: NoSyncOptions): boolean
function nosync(folders: string[], options?: NoSyncOptions): boolean
function nosync(folders: FolderMap, options?: NoSyncOptions): boolean
function nosync(folders: string | string[] | FolderMap, options: NoSyncOptions = {}) {
	let success = false
	if (utils.Object.isString(folders))
		success = nosync([folders], options)
	else if (Array.isArray(folders))
		success = nosync(utils.Array.toObject(folders, fldr => [fldr, fldr]), options)
	else {
		const { base = './.nosync', overwrite = false } = options
		utils.Object.forEach(folders, (dest, link: string) => {
			const nosyncPath = path.join(base, dest)
			if (fs.existsSync(link))
				fs.moveSync(link, nosyncPath, { overwrite })
			else if (!fs.existsSync(nosyncPath))
				fs.ensureDirSync(nosyncPath)
			fs.ensureSymlinkSync(nosyncPath, link)
		})
		success = true
	}
	return success
}

export default nosync
