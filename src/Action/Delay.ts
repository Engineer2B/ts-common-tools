import { Unit } from '../Utility/Unit';

export const constantDelay = (time: number) => {
	return new Promise(resolve => {
		setTimeout(resolve, time * Unit.THOUSAND);
	});
};