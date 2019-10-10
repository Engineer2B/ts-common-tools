export class Assert {
	/**
	 * Throws an error when unreachable code is reached unexpectedly.
	 * Can be used to enforce exhaustively checking all cases in a switch statement.
	 * http://stackoverflow.com/a/39419171
	 * 9-3-2016: DOES NOT WORK WHEN YOU HAVE AN ENUM WITH ONLY 1 VALUE.
	 * @param {never} x - Any unexpected variable.
	 */
	public static Unreachable(x: never): never {
		throw new Error("Didn't expect to get here");
	}
}