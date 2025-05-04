import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

async function initDb() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db('myapp');
    const usersCollection = db.collection('users');

    // Hash password
    const hashedPassword = await bcrypt.hash('123456789', 10);

    // Insert admin user
    await usersCollection.insertOne({
      username: 'admin',
      type: 'administrator',
      password: hashedPassword,
      create_date: new Date(),
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}

initDb();