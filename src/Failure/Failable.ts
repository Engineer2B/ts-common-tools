import { Exception } from '../Exception/Exception';
import { IFailable } from './IFailable';
import { Reason } from './Reason';

export type TPromiseFailable<GValue, GReason, GData> = Promise<Failable<GValue, GReason, GData>>;

export class Failable<GValue, GReasonE, GData> {
	protected constructor(
		protected readonly value: GValue | undefined,
		protected failed: boolean = false,
		protected reason?: Reason<GReasonE, GData>) {
	}

	public static Failed<GReasonE, GData>(message: string, reasonType: GReasonE, data?: GData): Failable<undefined, GReasonE, GData> {
		return new Failable(undefined, true, Reason.New(message, reasonType, data));
	}

	public static Success<GValue, GReasonE, GData>(value: GValue): Failable<GValue, GReasonE, GData> {
		return new Failable(value);
	}

	public static FromReason<GReasonE, GData>(reason: Reason<GReasonE, GData | undefined>): Failable<undefined, GReasonE, GData | undefined> {
		return new Failable(undefined, true, reason);
	}

	public static FromDto<GValue, GReasonE, GData>(dto: IFailable<GValue, GReasonE, GData>): Failable<GValue, GReasonE, GData> {
		return new Failable(dto.value, dto.failed, dto.reason ? Reason.FromDto(dto.reason) : dto.reason);
	}

	public static Summarize<GValue, GReasonE, UValue, GData>(inputs: Failable<GValue, GReasonE, GData>[],
		conversionFunction: (inputs: GValue[]) => UValue, multipleReasonsEnum: GReasonE): Failable<UValue | undefined, GReasonE, GData | undefined | (GData | undefined)[]> {
		const failedInputs = inputs.filter(input => input.failed);
		if (failedInputs.length > 0) {
			if (failedInputs.length > 1) {
				return Failable.FromReason<GReasonE, GData | undefined | (GData | undefined)[]>(
					Reason.Merge(
						failedInputs.map(failedInput => (failedInput.reason as Reason<GReasonE, GData | undefined>)),
						multipleReasonsEnum));
			}

			return Failable.FromReason<GReasonE, GData>(failedInputs[0].reason as Reason<GReasonE, GData | undefined>);
		}

		return Failable.Success<UValue, GReasonE, GData>(conversionFunction(inputs.map(inputValue => inputValue.ValueOrThrow)));
	}

	public static Join<GValue, GReason, UValue, VValue, GData>(inputs: [Failable<GValue, GReason, GData>, Failable<UValue, GReason, GData>],
		conversionFunction: (inputs: [GValue, UValue]) => VValue, multipleReasonsEnum: GReason): Failable<VValue | undefined, GReason, GData | undefined | (GData | undefined)[]> {
		const failedInputs = inputs.filter(input => input.HasFailed);
		if (failedInputs.length > 0) {
			if (failedInputs.length > 1) {
				return Failable.Failed<GReason, (GData | undefined)[]>(
					failedInputs.map(failedInput => (failedInput.Reason as Reason<GReason, GData | undefined>).Message).join(' and '),
					multipleReasonsEnum,
					failedInputs.map(failedInput => (failedInput.Reason as Reason<GReason, GData | undefined>).Data));
			}
			const reason = failedInputs[0].Reason as Reason<GReason, GData | undefined>;

			return Failable.Failed<GReason, GData>(reason.Message, reason.Value, reason.Data);
		}

		return Failable.Success<VValue, GReason, GData>(conversionFunction([inputs[0].ValueOrThrow, inputs[1].ValueOrThrow]));
	}

	public get ValueOrThrow(): GValue {
		if (!this.failed) {
			return this.value as GValue;
		}
		throw new Exception((this.reason as Reason<GReasonE, GData | undefined>).Message);
	}

	public get HasFailed(): boolean {
		return this.failed;
	}

	public get Reason(): Reason<GReasonE, GData | undefined> | undefined {
		return this.reason;
	}

	public Fail(message: string, reasonType: GReasonE, data: GData): void {
		this.reason = Reason.New(message, reasonType, data);
		this.failed = true;
	}

	public Select<UValue>(conversionFunction: (input: GValue) => UValue): Failable<UValue | undefined, GReasonE, GData> {
		if (this.failed) {
			return Failable.Failed((this.reason as Reason<GReasonE, GData | undefined>).Message,
				(this.reason as Reason<GReasonE, GData | undefined>).Value,
				(this.reason as Reason<GReasonE, GData | undefined>).Data);
		}

		return Failable.Success(conversionFunction(this.value as GValue));
	}

	public ThenIfSuccesful<UValue, UReasonE>(conversionFunction: (input: GValue) => Promise<Failable<UValue, GReasonE, GData>>): Promise<Failable<UValue, GReasonE | UReasonE, GData>> {
		if (this.failed) {
			return Promise.resolve(this.ConvertFailedType<UValue>());
		}

		return conversionFunction(this.value as GValue);
	}

	public ConvertFailedType<UValue>(): Failable<UValue, GReasonE, GData> {
		if (!this.failed) {
			throw new Exception('This method only accepts failed Failable.');
		}

		return this as unknown as Failable<UValue, GReasonE, GData>;
	}
}