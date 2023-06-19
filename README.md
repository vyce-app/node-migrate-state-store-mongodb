# node-migrate-state-store-mongodb
This is a [state storage implementation](https://github.com/tj/node-migrate#custom-state-storage) for the [`node-migrate`](https://github.com/tj/node-migrate) framework. It will store your migation state in a MongoDB collection called `migrations` as separate documents.

## Usage

1. Install the package
```
$ npm install @vyce/migrate-state-store-mongodb
$ yarn add @vyce/migrate-state-store-mongodb
```
2. Create a file to configure and expose the state storage
```ts
// state-store.ts
const { MongoStateStore } = require('@vyce/migrate-state-store-mongodb');

class StateStore extends MongoStateStore {
	constructor() {
		super({
			uri: 'mongodb://localhost:27017',
			collectionName: 'migrations',
		});
	}
};

module.exports = StateStore;
```
3. Use the state storage in your migration scripts
```json
// package.json
{
  "scripts": {
    "migrate:up": "migrate --store=\"./state-store.ts\" up",
		    "migrate:down": "migrate --store=\"./state-store.ts\" down",
  }
}
```

## Development
- Clone the repository
- Run `npm install` to install dependencies
- Make changes, create new branch and commit & push

## Releasing a new version
- Run `npm run version [patch|minor|major]` to bump the version
- Commit and push changes
- Create pull request to master
- Merge PR to master and GitHub Action will build, publish and then tag the commit if successful