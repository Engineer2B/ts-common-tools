// tslint:disable: no-magic-numbers
import { test } from 'node:test';
import { Maths } from '../../src/Utility/Maths';
import assert from 'node:assert';

test('Round10', () => {
	assert.strictEqual(Maths.Round10(0.555, -2), 0.56);
});
