import { Unit } from '../Utility/Unit';

/**
 * Delay an action by a number of seconds.
 * @param time Delay time in seconds.
 */
export const constantDelay = (time: number) => {
	return new Promise(resolve => {
		setTimeout(resolve, time * Unit.THOUSAND);
	});
};