export class Page {
	constructor(
		private readonly _title: string,
		private readonly _description: string,
		private readonly _content: string,
		private readonly _slug: string,
	) {}

	get title(): string {
		return this._title;
	}

	get description(): string {
		return this._description;
	}

	get content(): string {
		return this._content;
	}

	get slug(): string {
		return this._slug;
	}
}
