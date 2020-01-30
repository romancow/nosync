import * as fs from 'fs-extra'
import * as path from 'path'
import * as utils from './utilities'
import { PathMap, NoSyncOptions } from './options'

/**
 * Moves the file or folder at the given `path` to a folder ignored by iCloud,
 * and creates a symlink to it in its place.
 *
 * @param path - Path to the file or folder to not sync to iCloud
 * @param options - Options for moving and symlinking file or folder
 */
function nosync(path: string, options?: NoSyncOptions): Promise<void>

/**
 * Moves the files and folders at the given `paths` to a folder ignored by iCloud,
 * and creates a symlink to them in their place.
 *
 * @param paths - Paths to the files or folders to not sync to iCloud
 * @param options - Options for moving and symlinking files and folders
 */
function nosync(paths: string[], options?: NoSyncOptions): Promise<void>

/**
 * Moves the files and folders at the given `paths` to a folder ignored by iCloud,
 * and creates a symlink to them in their place.
 *
 * @param paths - An object mapping files or folders to be symlinked to where they should be located in the "nosync" folder
 * @param options - Options for moving and symlinking files and folders
 */
function nosync(paths: PathMap, options?: NoSyncOptions): Promise<void>

async function nosync(paths: string | string[] | PathMap, options: NoSyncOptions = {}) {
	const { base = './.nosync', check = false, overwrite = false } = options
	const normalizedPaths = PathMap.normalizePaths(paths)
	const  nosyncs = utils.Object.collect(normalizedPaths, async (dest, link: string) => {
		if (check && !utils.Path.isiCloud(link)) {
			console.log("Skipping non-iCloud path:", link)
			return
		}

		const nosyncPath = path.join(base, dest)
		const linkExists = await fs.pathExists(link) && (await fs.lstat(link)).isSymbolicLink()

		if (linkExists && (await fs.readlink(link) !== nosyncPath))
			await fs.remove(link)

		if (!linkExists && await fs.pathExists(link))
			await fs.move(link, nosyncPath, { overwrite })
		else if (!(await fs.pathExists(nosyncPath)))
			await fs.ensureDir(nosyncPath)
		else if (overwrite && !(await fs.lstat(nosyncPath)).isDirectory()) {
			await fs.remove(nosyncPath)
			await fs.ensureDir(nosyncPath)
		}

		await fs.ensureSymlink(nosyncPath, link)
	})
	await Promise.all(nosyncs)
}

export default nosync
