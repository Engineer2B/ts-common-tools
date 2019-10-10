/**
 * A class with extensions to the Math library.
 */
export class Maths {
	public static RoundingDigits = 8;

	/**
	 * Base 10 decimal round a number.
	 * @param {number} value The number.
	 * @param {number} exp The exponent (the base 10 logarithm of the adjustment base).
	 * @returns {number} The adjusted value.
	 */
	public static Round10(value: number, exp: number): number {
		return Maths.DecimalAdjust('round', value, exp);
	}

	/**
	 * Decimal floor with adjustment base.
	 * @param {number} value The number.
	 * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
	 * @returns {number} The adjusted value.
	 */
	public static Floor10(value: number, exp: number): number {
		return Maths.DecimalAdjust('floor', value, exp);
	}

	/**
	 * Decimal ceil with adjustment base.
	 * @param {number} value The number.
	 * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
	 * @returns {number} The adjusted value.
	 */
	public static Ceil10(value: number, exp: number): number {
		return Maths.DecimalAdjust('ceil', value, exp);
	}

	/**
	 * Decimal floor with adjustment base of RoundingDigits.
	 * @param {number} value The number.
	 * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
	 * @returns {number} The adjusted value.
	 */
	public static Flo(value: number, significantDigits = Maths.RoundingDigits): number {
		return Maths.DecimalAdjust('floor', value, -significantDigits);
	}

	/**
	 * Decimal round with adjustment base of RoundingDigits.
	 * @param {number} value The number.
	 * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
	 * @returns {number} The adjusted value.
	 */
	public static Ro(value: number,
		significantDigits = Maths.RoundingDigits): number {
		return Maths.DecimalAdjust('round', value, -significantDigits);
	}

	/**
	 * Decimal floor with adjustment base of RoundingDigits.
	 * @param {number} value The number.
	 * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
	 * @returns {string} The adjusted value.
	 */
	public static FloStr(value: number, significantDigits = Maths.RoundingDigits): string {
		return Maths.Floor10(value, -significantDigits).toLocaleString(undefined, { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 10 });
	}

	/**
	 * Decimal round with adjustment base of RoundingDigits.
	 * @param {number} value The number.
	 * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
	 * @returns {string} The adjusted value.
	 */
	public static RoStr(
		value: number,
		significantDigits = Maths.RoundingDigits): string {
		return Maths.Ro(value, significantDigits).toLocaleString(undefined, { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 10 });
	}

	public static Str(value: number): string {
		return value.toLocaleString(undefined, { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 10 });
	}

	/**
	 * Given a number i, a maximal value max and a minimal value min,
	 * calculates Clip[i,{min,max}].
	 * @param {number} value The input value.
	 * @param {number} minValue The minimal value, default is 0.
	 * @param {number} maxValue The maximal value, default is max int.
	 */
	public static Clip(
		value: number,
		minValue: number = 0,
		maxValue: number = Number.MAX_VALUE) {
		return Math.max(Math.min(value, maxValue), minValue);
	}

	/**
	 * Verifies whether the input is a number.
	 * @param {any} n Any input.
	 * @returns {boolean} Whether or not the input is a number.
	 */
	public static IsNumber(n: any): boolean {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/**
 * Decimal adjustment of a number.
 * @param {string} type The type of adjustment.
 * @param {number} value The number.
 * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
 * @returns {number} The adjusted value.
 */
	protected static DecimalAdjust(type: string, value: number, exp: number): number {
		// If the exp is zero...
		if (+exp === 0) {
			return (Math as any)[type](value);
		}
		value = +value;
		exp = +exp;
		// If the value is not a number or the exp is not an integer...
		if (!(exp % 1 === 0)) {
			return NaN;
		}
		// Shift
		let stringValue = value.toString().split('e');
		value = (Math as any)[type](+(`${stringValue[0]}e${(stringValue[1] ? (+stringValue[1] - exp) : -exp)}`));

		// Shift back
		stringValue = value.toString().split('e');

		return +(`${stringValue[0]}e${(stringValue[1] ? (+stringValue[1] + exp) : exp)}`);
	}
}
