export class ReplaceValue {

	public static New(regexString: RegExp, value: string): ReplaceValue {
		return new ReplaceValue(regexString, value);
	}

	public Execute(input: string): string {
		return input.replace(new RegExp(this.RegexString), this.ReplacementValue);
	}

	protected constructor(public RegexString: RegExp, public ReplacementValue: string) { }
}