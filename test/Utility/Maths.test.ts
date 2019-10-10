// tslint:disable: no-magic-numbers
import { Maths } from '../../src/Utility/Maths';

test('Round10', () => {
	expect(Maths.Round10(0.555, -2)).toBe(0.56);
});
