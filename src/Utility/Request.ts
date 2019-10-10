// tslint:disable: no-magic-numbers
import * as http from 'http';
import * as https from 'https';
import * as qs from 'qs';
import { RequestTypeE } from '../Enum/RequestType';
import { Logger } from './Logger';
import * as crypto from 'crypto';

export type Response = {
	Data: string;
	Headers: string[];
};
export type Rejection = {
	Status?: number;
	Error?: Error;
	Headers?: http.IncomingHttpHeaders;
};

/**
 * Provides functionality for making webAPI requests.
 */
export class Request {
	/**
	 * Perform an HTTP request.
	 * @param {string} domainName The host url.
	 * @param {string} path The path of the request.
	 * @param {string} [requestType="GET"] The type of request.
	 * @param {Object} [headers] A dictionary of headers.
	 * @param {object} [bodyData] An object with data that is put in the body.
	 * @returns {Promise<string>} The result as a string wrapped in a promise.
	 */
	public static Make(
		domainName: string,
		path: string,
		requestType: RequestTypeE = RequestTypeE.GET,
		headers?: { [index: string]: string; },
		bodyData?: Object,
		useHttps: boolean = true): Promise<Response> {
		return new Promise<Response>((resolveCb, rejectCb) => {
			Request.send(resolveCb, rejectCb, domainName, path, requestType, headers, bodyData, useHttps);
		});
	}

	public static GetUUID(): string {
		const pool = 31 * 128; // 36 chars minus 4 dashes and 1 four
		let r = crypto.randomBytes(pool);
		let j = 0;
		const str = '10000000-1000-4000-8000-100000000000';
		const len = str.length; // 36
		const strs = [];

		strs.length = len;
		strs[8] = '-';
		strs[13] = '-';
		strs[18] = '-';
		strs[23] = '-';

		for (let chi = 0; chi < len; chi++) {
			const ch = str[chi];
			if ('-' === ch || '4' === ch) {
				strs[chi] = ch;
				continue;
			}

			// no idea why, but this is almost 4x slow if either
			// the increment is moved below or the >= is changed to >
			j++;
			if (j >= r.length) {
				r = crypto.randomBytes(pool);
				j = 0;
			}

			if ('8' === ch) {
				strs[chi] = (8 + r[j] % 4).toString(16);
				continue;
			}

			strs[chi] = (r[j] % 16).toString(16);
		}

		return strs.join('');
	}

	private static send(resolveCb: (value: Response) => void, rejectCb: (value: Rejection) => void,
		domainName: string, path: string, requestType: RequestTypeE,
		headers?: { [index: string]: string; }, bodyData?: Object, useHttps?: boolean): void {
		const options: https.RequestOptions = {};
		options.hostname = domainName;
		options.path = path;
		options.headers = headers;
		options.method = RequestTypeE[requestType];
		options.rejectUnauthorized = false;
		let req: http.ClientRequest;
		if (useHttps) {
			req = https.request(options,
				(response: http.IncomingMessage) => {
					Request.handleRequestAndConvertData(response, resolveCb, rejectCb, options, bodyData);
				});
		} else {
			req = http.request(options,
				(response: http.IncomingMessage) => {
					Request.handleRequestAndConvertData(response, resolveCb, rejectCb, options, bodyData);
				});
		}

		if (bodyData) {
			req.write(qs.stringify(bodyData));
		}
		// Use the reject callback for any error.
		req.on('error', rejectCb);
		req.on('timeout', () => { Request.handleTimeout(req, options, rejectCb); });
		const requestEvents = ['abort', 'checkExpectation', 'connect', 'continue', 'upgrade', 'OCSPResponse'];
		// Capture any other events.
		requestEvents.forEach((requestEvent: string) => {
			req.on(requestEvent,
				data => {
					Logger.ShowMessage(`Unhandled event "${requestEvent}", data:\n${data}\n`);
				});
		});
		req.end();
	}

	private static handleTimeout(
		request: http.ClientRequest,
		options: https.RequestOptions,
		rejectCb: (value: Rejection) => void
	): void {
		request.abort();
		rejectCb({ Error: new Error(`Request to ${options.hostname}${options.path} timed out.`) });
	}

	private static handleRequestAndConvertData(
		response: http.IncomingMessage,
		resolveCb: (value: Response) => void,
		rejectCb: (value: Rejection) => void,
		options: http.RequestOptions,
		bodyData?: Object
	): void {
		if (response.statusCode && response.statusCode !== 200) {
			if (response.statusCode === 301 && response.headers.location !== undefined && options.path && options.method) {
				Request.send(resolveCb, rejectCb, response.headers.location.replace(options.path, '').replace('https://', ''), options.path, (RequestTypeE as any)[options.method], options.headers as { [index: string]: string; }, bodyData);
			} else {
				Logger.ShowMessage(`Server sends status code ${response.statusCode}: ${response.statusMessage}.`);
				Logger.ShowMessage(`Location: ${response.headers.location}.`);
				rejectCb({ Status: response.statusCode, Error: undefined, Headers: response.headers });
			}
		}
		response.setEncoding('utf8');
		let rawData = '';
		response.on('data', (chunk: string) => {
			rawData += chunk;
		});
		response.on('end', () => {
			if (response.statusCode !== 301) {
				resolveCb({ Data: rawData, Headers: response.rawHeaders });
			}
		});
	}
}
