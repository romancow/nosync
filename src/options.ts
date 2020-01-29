import * as fs from 'fs-extra'
import * as utils from './utilities'

/**
 * Options for moving and symlinking files and folders.
 */
export type NoSyncOptions = {
	/**
	 * The folder to use as the "nosync" folder where symlinked files and folder will be moved to
	 */
	base?: string
	/**
	 * Whether or not to ensure files or folders exist on an iCloud drive before "nosyncing" them
	 */
	check?: boolean
	/**
	 * Wether or not to overwrite existing files or folders in the "nosync" folder when moving them
	 */
	overwrite?: boolean
}

/**
 * A map of files and folders to where they should symlinked to in the "nosync" folder.
 */
type PathMap = { [path: string]: string }

namespace PathMap {

	/**
	 * Normalizes nosync paths (none, single, array, or map) to a `PathMap`.
	 *
	 * @param paths - The missing, single, array, or map of paths to normalize.
	 * @returns A `PathMap` of nosync paths.
	 */
	export function normalizePaths(paths: undefined | null | string | string[] | PathMap): PathMap {
		if (paths == null)
			return {}
		else if (utils.Object.isString(paths))
			return normalizePaths([paths])
		else if (Array.isArray(paths))
			return utils.Array.toObject(paths, path => [path, path])
		else return paths
	}

	/**
	 * Gets the nosync paths defined in a json file.
	 *
	 * @param file - A json file defining nosync paths
	 * @returns A `PathMap` of nosync paths defined in the json `file`
	 */
	export function fromJson(file: string) {
		const paths = fs.existsSync(file) ? fs.readJsonSync(file) : null
		return paths ? normalizePaths(paths) : null
	}
}

export { PathMap }
