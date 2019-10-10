/**
 * A class with extensions to the Math library.
 */
export declare class Maths {
    static RoundingDigits: number;
    /**
     * Base 10 decimal round a number.
     * @param {number} value The number.
     * @param {number} exp The exponent (the base 10 logarithm of the adjustment base).
     * @returns {number} The adjusted value.
     */
    static Round10(value: number, exp: number): number;
    /**
     * Decimal floor with adjustment base.
     * @param {number} value The number.
     * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
     * @returns {number} The adjusted value.
     */
    static Floor10(value: number, exp: number): number;
    /**
     * Decimal ceil with adjustment base.
     * @param {number} value The number.
     * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
     * @returns {number} The adjusted value.
     */
    static Ceil10(value: number, exp: number): number;
    /**
     * Decimal floor with adjustment base of RoundingDigits.
     * @param {number} value The number.
     * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
     * @returns {number} The adjusted value.
     */
    static Flo(value: number, significantDigits?: number): number;
    /**
     * Decimal round with adjustment base of RoundingDigits.
     * @param {number} value The number.
     * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
     * @returns {number} The adjusted value.
     */
    static Ro(value: number, significantDigits?: number): number;
    /**
     * Decimal floor with adjustment base of RoundingDigits.
     * @param {number} value The number.
     * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
     * @returns {string} The adjusted value.
     */
    static FloStr(value: number, significantDigits?: number): string;
    /**
     * Decimal round with adjustment base of RoundingDigits.
     * @param {number} value The number.
     * @param {number} [significantDigits = Maths.RoundingDigits] The number of significant digits.
     * @returns {string} The adjusted value.
     */
    static RoStr(value: number, significantDigits?: number): string;
    static Str(value: number): string;
    /**
     * Given a number i, a maximal value max and a minimal value min,
     * calculates Clip[i,{min,max}].
     * @param {number} value The input value.
     * @param {number} minValue The minimal value, default is 0.
     * @param {number} maxValue The maximal value, default is max int.
     */
    static Clip(value: number, minValue?: number, maxValue?: number): number;
    /**
     * Verifies whether the input is a number.
     * @param {any} n Any input.
     * @returns {boolean} Whether or not the input is a number.
     */
    static IsNumber(n: any): boolean;
    /**
 * Decimal adjustment of a number.
 * @param {string} type The type of adjustment.
 * @param {number} value The number.
 * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
 * @returns {number} The adjusted value.
 */
    protected static DecimalAdjust(type: string, value: number, exp: number): number;
}
