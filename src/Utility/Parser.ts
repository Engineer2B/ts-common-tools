import { RequestFailureE } from '../Enum/Failure/Request';
import { Failable } from '../Failure/Failable';
import { Logger } from './Logger';

/**
 * For parsing JSON responses.
 */
export class Parser {
	/**
	 * Parses and converts the JSON string object to a javascript object.
	 * @param {any} jsObject The JSON string object.
	 * @returns {Failable<GResponse>} A response object.
	 */
	public static ToResponse<GResponse>(jsObject: any): Failable<GResponse, RequestFailureE, {}> {
		return Parser.ToRawResponse(jsObject)
			.Select((input: any) => {
				const output = Parser.convertResult(input);

				return output;
			});
	}

	/**
 * Parses the JSON string object to a javascript object with nested strings intact.
 * @param {any} jsObject The JSON string object.
 * @returns {Failable<GResponse>} A raw response object.
 */
	public static ToRawResponse<GResponse>(jsObject: any):
	Failable<GResponse | undefined, RequestFailureE, {}> {
		let parsedResponse: Failable<GResponse | undefined, RequestFailureE, {}>;
		try {
			parsedResponse = Failable.Success<GResponse, RequestFailureE, {}>(JSON.parse(jsObject));
		} catch (error) {
			Logger.ShowMessage('Server timed out...');
			parsedResponse = Failable.Failed<RequestFailureE, {}>('Server timed out...', RequestFailureE.ServerUnavailable);
		}

		return parsedResponse;
	}

	/**
	 * Tries to parse the input string as JSON, returns an error if it can't.
	 * @param {string} input Some input string.
	 * @returns {any} Returns an object or the string, unparsed.
	 */
	public static TryParseJSON(input: string): any {
		try {
			return JSON.parse(input);
		} catch (e) {
			return input;
		}
	}

	/**
	 * Parses object using tryParseJSON when it can.
	 * @param {any} jsObject Any JSON object.
	 * @returns {any} A parsed JSON object.
	 */
	private static convertResult(jsObject: any): any {
		let typeName: string;
		let theObject: any;
		for (const property in jsObject) {
			if (!jsObject.hasOwnProperty(property)) {
				continue;
			}
			theObject = jsObject[property];
			typeName = typeof theObject;
			if (theObject === undefined || theObject === null) {
				jsObject[property] = undefined;
				continue;
			}
			if (typeName === 'object') {
				if (theObject.hasOwnProperty('length')) {
					if (theObject.length === 0) {
						continue;
					}
					const numberOfObjects = theObject.length;
					const theNewObject = [];
					for (let indexObject = 0; indexObject < numberOfObjects; indexObject++) {
						typeName = typeof theObject[indexObject];
						if (typeName === 'object') {
							theNewObject[indexObject] = Parser.convertResult(theObject[indexObject]);
						} else {
							theNewObject[indexObject] = theObject[indexObject];
						}
					}
					jsObject[property] = theNewObject;
				} else {
					jsObject[property] = Parser.convertResult(theObject);
				}
			} else if (typeName === 'undefined') {
				throw new Error('Result contains an undefined property!');
			} else {
				jsObject[property] = Parser.TryParseJSON(theObject);
			}
		}

		return jsObject;
	}
}
