import * as os from 'os'
import * as PathUtils from 'path'

const ICLOUD_DIR = (platformDir => platformDir && PathUtils.join(os.homedir(), platformDir))
	(({
		darwin: "Library/Mobile\ Documents/com~apple~CloudDocs/",
		win32: "iCloudDrive"
	} as Record<string,string>)[os.platform()])

namespace _Object {
	export function isString(obj: any): obj is string {
		return (Object.getPrototypeOf(obj) === String.prototype)
	}

	export function collect<T, K extends keyof T, U>(obj: T, fn: (val: T[K], key: K, obj: T) => U) {
		const keys = Object.keys(obj) as K[]
		return keys.map((key: K) => fn(obj[key], key, obj))
	}
}

namespace _Array {
	export function ensure<T>(unensuredArray: T | T[]){
		return Array.isArray(unensuredArray) ? unensuredArray : [unensuredArray]
	}

	export function toObject<T, U>(arr: T[], map: (item: T, arr: T[]) => [string, U]) {
		return arr.reduce((obj, item) => {
			const [key, val] = map(item, arr)
			obj[key] = val
			return obj
		}, {} as { [key: string]: U })
	}
}

namespace Path {
	export function isiCloud(path: string) {
		const resolved = PathUtils.resolve(path)
		return resolved.startsWith(ICLOUD_DIR)
	}
}

export {
	_Object as Object,
	_Array as Array,
	Path
}
