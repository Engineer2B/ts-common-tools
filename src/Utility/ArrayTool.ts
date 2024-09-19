/**
 * A class with extensions to the Array library.
 */
export class ArrayTool {
	/**
	 * Returns the unique values in an array.
	 * @param {T[]} array_in Any array.
	 */
	public static Unique(array_in: string[]): string[] {
		let i;
		const len = array_in.length,
		out = [],
		obj: {[index: string]: number} = {};

		for (i = 0; i < len; i++) {
			obj[array_in[i]] = 0;
		}
		for (i in obj) {
			if(obj.hasOwnProperty(i)){
				out.push(i);
			}
		}

		return out;
	}

	/**
	 * Sorts the properties of an object.
	 * @param {any} object The object that is to be sorted.
	 */
	public static Sort_object(object: any): any[] {
		let keyObject;
		const objectSorted = [];
		for (keyObject in object) {
			if (object.hasOwnProperty(keyObject)) {
				objectSorted.push(keyObject);
			}
		}

		return objectSorted.sort();
	}
}