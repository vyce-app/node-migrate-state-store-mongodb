import type { Db, WithId } from 'mongodb';
import { MongoClient } from 'mongodb';

interface Options {
	uri: string;
	collectionName?: string;
}

type Migration = {
	title: string;
	description: string;
	timestamp: number | null;
};

type Set = {
	migrations?: Migration[];
	lastRun: string | null;
};

type LoadCallback = ((error: Error) => void) & ((error: null, set: Set) => void);

export class MongoStateStore {
	private readonly collectionName: string;

	private readonly mongodbHost: string;

	constructor(objectOrHost: Options | string) {
		this.mongodbHost = typeof objectOrHost === 'string' ? objectOrHost : objectOrHost.uri;
		this.collectionName = (objectOrHost as Options).collectionName ?? 'migrations';
	}

	public load(fn: LoadCallback): void {
		this.tryHandle(fn, async db => {
			const result = await db.collection(this.collectionName)
				.find({})
				.sort({ timestamp: -1 })
				.toArray() as WithId<Migration>[];

			if (result.length === 0) {
				console.log('No migrations found, probably running the very first time');
				return {
					lastRun: null,
				};
			}

			const set: Set = {
				migrations: result,
				lastRun: result[0]?.title ?? null,
			};

			return set;
		});
	}

	public save(set: Set, fn: (err: Error | null) => void): void {
		const { migrations } = set;

		this.tryHandle(fn, async db => {
			if (migrations) {
				const bulk = db.collection(this.collectionName).initializeUnorderedBulkOp();

				// eslint-disable-next-line fp/no-loops, no-restricted-syntax
				for (const migration of migrations) {
					bulk.find({ title: migration.title }).upsert().updateOne({ $set: migration });
				}

				await bulk.execute();
			}

			return set;
		});
	}

	private tryHandle(
		fn: LoadCallback, actionCallback: (db: Db) => Promise<Set>,
	): void {
		(async () => {
			let client: MongoClient | null = null;

			try {
				client = await MongoClient.connect(this.mongodbHost);
				const db = client.db();
				const result = await actionCallback(db);

				fn(null, result);
			} catch (err) {
				fn(err as Error);
			} finally {
				if (client) {
					try {
						await client.close();
					} catch (err) {
						// ignore
					}
				}
			}
		})().catch(() => {
			// ignore (handled via fn above)
		});
	}
}
