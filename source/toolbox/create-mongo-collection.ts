
import {CollectionConfig} from "../interfaces"
import {MongoClient, Collection} from "mongodb"

export async function createMongoCollection({
	uri,
	dbName,
	collectionName
}: CollectionConfig): Promise<Collection> {

	const client = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	await client.connect()
	return client.db(dbName).collection(collectionName)
}
