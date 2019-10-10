import { IReason } from './IReason';

export interface IFailable<GValue, GReason, GData> {
	value: GValue | undefined;
	failed: boolean;
	reason?: IReason<GReason, GData>;
}
