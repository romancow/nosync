namespace _Object {
	export function isString(obj: any): obj is string {
		return (Object.getPrototypeOf(obj) === String.prototype)
	}

	export function forEach<T, K extends keyof T>(obj: T, fn: (val: T[K], key: K, obj: T) => void) {
		const keys = Object.keys(obj) as K[]
		keys.forEach(key => fn(obj[key], key, obj))
	}
}

namespace _Array {
	export function toObject<T, U>(arr: T[], map: (item: T, arr: T[]) => [string, U]) {
		return arr.reduce((obj, item) => {
			const [key, val] = map(item, arr)
			obj[key] = val
			return obj
		}, {} as { [key: string]: U })
	}
}

export {
	_Object as Object,
	_Array as Array
}
