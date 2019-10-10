export interface IReason<GValueEnum, GData> {
	/**
	 * The message.
	 */
	message: string;
	/**
	 * An enum for the reason of failure.
	 */
	value: GValueEnum;

	/**
	 * Any data.
	 */
	data?: GData;
}