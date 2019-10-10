import * as util from 'util';

import { Exception } from '../Exception/Exception';
import { Unit } from '../Utility/Unit';
import { Delay } from './Delay';

export class Timing {
	private static setTimeoutPromise = util.promisify(setTimeout);

	public static async DelayWithAction<G>(delay: Delay, retryAction: (changedDelay: Delay) => Promise<G>, noRetryObject: G | Exception): Promise<G> {
		if (delay.Retries > 0) {
			await Timing.Delay(delay.Time);

			return retryAction(delay.Next());
		}
		if (noRetryObject instanceof Exception) {
			throw noRetryObject;
		}

		return Promise.resolve(noRetryObject);
	}

	public static async DelayAction<G>(delay: Delay, action: () => Promise<G>): Promise<G> {
		await Timing.Delay(delay.Time);

		return action();
	}

	/**
	 * Delay an action.
	 * @param {number} delay The delay [s].
	 * @returns {Promise<void>} A promise that resolves after @param delay seconds.
	 */
	public static Delay(delay: number): Promise<void> {
		return Timing.setTimeoutPromise(delay * Unit.THOUSAND);
	}

	public static get Now(): string {
		return new Date().toLocaleString();
	}

	public static get NowPrecies(): string {
		const theDate = new Date();

		return `${theDate.toLocaleString()}.${theDate.getMilliseconds()}`;
	}

	public static FileTimeStamp(): string {
		const theDate = new Date();

		return `${theDate.getFullYear()}-${(theDate.getMonth() + 1).toString().padStart(2, '0')}-${theDate.getDate().toString().padStart(2, '0')} ` +
			`${theDate.getHours().toString().padStart(2, '0')};${theDate.getMinutes().toString().padStart(2, '0')};${theDate.getSeconds().toString().padStart(2, '0')}`;
	}

	public static YearMonthDay(): string {
		const dateObj = new Date();
		const month = dateObj.getUTCMonth() + 1; //months from 1-12
		const day = dateObj.getUTCDate();
		const year = dateObj.getUTCFullYear();

		return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
	}
}