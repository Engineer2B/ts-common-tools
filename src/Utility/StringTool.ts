/**
 * Provides some basic string manipulation tools.
 */
export class StringTool {

	/**
	 * Capitalizes the first letter of the input string.
	 * @param {string} inputString - The input string.
	 * @returns {string} - The locally capitalised string.
	 */
	static Cap1(inputString: string): string {
		if (inputString.length > 0) {
			if (inputString.charAt(0) === '_') {
				if (inputString.length > 1) {
					return `_${StringTool.Cap1(inputString.substr(1, inputString.length))}`;
				} else {
					return '_';
				}
			}

			return inputString.charAt(0).toLocaleUpperCase() +
				inputString.substr(1, inputString.length - 1);
		} else {
			return '';
		}
	}

	/**
	 * Replaces a string by a value if it is a key in the relacement dictionary.
	 * @param {string} theString The input string.
	 * @param {Dictionary} replacementDictionary A dictionary of key value pairs.
	 */
	static CheckReplace(
		theString: string,
		replacementDictionary?: { [index: string]: string }): string {
		if (replacementDictionary) {
			const replacementString = replacementDictionary[theString];
			if (replacementString) {
				theString = replacementString;
			}
		}

		return theString;
	}

	static RFC_3986_encode_object(obj: { [key: string]: any }, prefix?: string): string {
		const keyValuePairs = [];
		for (const key in obj) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				continue
			}
			const encodedKey = this.rfc_3986_encode_str(key);
			const value = obj[key];
			let pair;
			pair = typeof value === 'object' ? this.RFC_3986_encode_object(value, prefix ? `${prefix}[${encodedKey}]` : encodedKey) : (prefix ? `${prefix}[${encodedKey}]` : encodedKey) + '=' + this.rfc_3986_encode_str(value);
			keyValuePairs.push(pair);
		}

		return keyValuePairs.join('&');
	}

	/**
	 * Pads the input string with n characters "x" to the left.
	 * @param {string} inputString The input string.
	 * @param {number} n The number of characters that get padded.
	 * @param {string} x The character that gets padded.
	 * @returns {string} The padded string.
	 */
	static PadLeft(inputString: string, n: number, x: string): string {
		return StringTool.Repeat(x, n).substring(0, n - inputString.length) + inputString;
	}

	/**
	 * Repeat a pattern an number of times.
	 * @param {string} pattern The repeated pattern.
	 * @param {number} count Number of times the pattern is to be repeated.
	 * @returns {string} The repeated pattern.
	 */
	static Repeat(pattern: string, count: number): string {
		if (count < 1) {
			return '';
		}
		let result = '';
		while (count > 1) {
			if (count & 1) {
				result += pattern;
			}
			count >>= 1;
			pattern += pattern;
		}

		return result + pattern;
	}

	private static rfc_3986_encode_str(str: string): string {
		return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	}
}

