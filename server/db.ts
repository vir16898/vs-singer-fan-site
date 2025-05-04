import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'myapp';

export async function connectToMongo() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  console.log('Connected to MongoDB');
  return db;
}