import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "Anon";

if (!uri) throw new Error("MONGO_URI is not configured");

const globalForMongo = globalThis;
export const mongoClient = globalForMongo.__zaidLudoMongo || new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo.__zaidLudoMongo = mongoClient;

export async function getDb() {
  await mongoClient.connect();
  return mongoClient.db(dbName);
}
