type TObject = { [key: string]: any };
export class Objects {
	public static SortKeys(anObject: TObject): object {
		const ordered: TObject = {};
		Object.keys(anObject).sort().forEach(key => {
			ordered[key] = anObject[key];
		});

		return ordered;
	}

	public static ToString(anObject: TObject): string {
		return Object.keys(anObject)
			.map(valueKey => `${valueKey}: ${anObject[valueKey]}`)
			.join(', ');
	}

	/**
	 * Creates an object entry in an object and returns the new entry so you can edit it.
	 * Just returns the object entry if it already exists.
	 * @param {object} anObject The object onto which the field is created.
	 * @param {any} key The name of the field.
	 * @returns {object} The newly created object.
	 */
	public static CreateObjectEntry(anObject: TObject, key: string): object {
		if (!anObject[key]) {
			anObject[key] = {};
		}

		return anObject[key];
	}

	/**
	 * Create an array on an object under the given key and returns this new array.
	 * Just returns the array entry if it already exists.
	 * @param {object} anObject The object onto which the array is created.
	 * @param {any} key The key to the newly created array.
	 * @returns {object} The newly created array.
	 */
	public static CreateArray(anObject: TObject, key: string): object[] {
		if (!anObject[key]) {
			anObject[key] = [];
		}

		return anObject[key];
	}

	public static RemoveEmptyFields(obj: TObject): void {
		for (const propName in obj) {
			if (obj[propName] === null || obj[propName] === undefined || (Array.isArray(obj[propName]) && obj[propName].length === 0)) {
				delete obj[propName];
			}
		}
	}

	public static UniqueBy<T>(objs: T[], key: (value: T) => string): T[] {
		const seen: TObject = {};

		return objs.filter(item => {
			const k = key(item);

			return seen.hasOwnProperty(k) ? false : (seen[k] = true);
		});
	}

	public static XOr<T>(objs1: T[], objs2: T[], key: (value: T) => string): T[] {
		const seen1: TObject = {};
		objs1 = objs1.filter(item => {
			const k = key(item);
			if (!seen1.hasOwnProperty(k)) {
				seen1[k] = true;

				return true;
			} else {
				return false;
			}
		});
		const seen2: TObject = {};
		objs2 = objs2.filter(item => {
			const k = key(item);
			if (!seen2.hasOwnProperty(k)) {
				seen2[k] = true;

				return true;
			} else {
				return false;
			}
		});

		return objs1.filter(item => seen2.hasOwnProperty(key(item)) ? false : true)
			.concat(objs2.filter(item => seen1.hasOwnProperty(key(item)) ? false : true));
	}
}