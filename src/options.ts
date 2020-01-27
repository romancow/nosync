import * as fs from 'fs-extra'
import * as utils from './utilities'

export type NoSyncOptions = {
	base?: string
	overwrite?: boolean
}

type PathMap = { [path: string]: string }

namespace PathMap {
	export function normalizePaths(paths: undefined | null | string | string[] | PathMap): PathMap {
		if (paths == null)
			return {}
		else if (utils.Object.isString(paths))
			return normalizePaths([paths])
		else if (Array.isArray(paths))
			return utils.Array.toObject(paths, path => [path, path])
		else return paths
	}

	export function fromJson(file: string) {
		const paths = fs.existsSync(file) ? fs.readJsonSync(file) : null
		return paths ? normalizePaths(paths) : null
	}
}

export { PathMap }
