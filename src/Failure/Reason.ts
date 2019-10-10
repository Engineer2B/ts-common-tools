import { IReason } from './IReason';

export class Reason<GValueEnum, GData>{
	public get Message(): string {
		return this.message;
	}
	public get Value(): GValueEnum {
		return this.value;
	}

	public get Data(): GData | undefined {
		return this.data;
	}

	protected constructor(private readonly message: string, private readonly value: GValueEnum, private readonly data?: GData) {
	}

	/**
	 * Generates a new instance of a Reason object.
	 * @param {string} message The message.
	 * @param {GValueEnum} value The value enum.
	 * @param {GData} data Any data associated with the error.
	 * @returns A reason object.
	 */
	public static New<GValueEnum, GData>(message: string, value: GValueEnum, data?: GData): Reason<GValueEnum, GData> {
		return new Reason<GValueEnum, GData>(message, value, data);
	}

	/**
	 * Generate a new instance of a Reason object.
	 * @param {IReason<TValueEnum>} dto A dto of the reason.
	 * @returns {Reason<TValueEnum>} A reason object.
	 */
	public static FromDto<GValueEnum, GData>(dto: IReason<GValueEnum, GData>): Reason<GValueEnum, GData> {
		return new Reason<GValueEnum, GData>(dto.message, dto.value, dto.data);
	}

	public static Merge<GValueEnum, GData>(reasons: Reason<GValueEnum, GData|undefined>[], multipleReasonsEnum: GValueEnum): Reason<GValueEnum, GData | undefined | (GData | undefined)[]> {
		if (reasons.every(reason => reason.value === reasons[0].value)) {
			return new Reason(reasons[0].message, reasons[0].value, reasons[0].data);
		}

		return new Reason(reasons.join(' and also '), multipleReasonsEnum, reasons.map(reason => reason.data));
	}

	public ConvertValueType<UData>(): Reason<GValueEnum, UData | undefined> {
		return this as unknown as Reason<GValueEnum, UData | undefined>;
	}

	public toString(): string {
		return this.message;
	}
}
