// tslint:disable: no-magic-numbers
import { suite, test } from 'node:test';
import assert from 'node:assert';
import { StringTool } from '../../src/Utility/StringTool';

suite('EncodeObjectToQueryString', () => {
	test('Object 1', () => {
		const myObject = {
			name: "Ada Lovelace",
			email: "ada.lovelace@example.com",
			city: "New York",
			bio: "I love programming! It's [fun] & challenging."
		};
		assert.strictEqual(StringTool.RFC_3986_encode_object(myObject), `name=Ada%20Lovelace&email=ada.lovelace%40example.com&city=New%20York&bio=I%20love%20programming%21%20It%27s%20%5Bfun%5D%20%26%20challenging.`);
	});
	test('Object 2', () => {
		const complexObject = {
			user: {
				name: "Jane Doe",
				preferences: {
					notifications: true,
					theme: "dark"
				}
			},
			token: "abc123"
		};
		assert.strictEqual(StringTool.RFC_3986_encode_object(complexObject), `user[name]=Jane%20Doe&user[preferences][notifications]=true&user[preferences][theme]=dark&token=abc123`);
	});
});
