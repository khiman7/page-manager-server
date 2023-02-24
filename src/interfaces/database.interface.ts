export interface IDatabase {
	client: unknown;
	connect(): void;
	disconnect(): void;
}
