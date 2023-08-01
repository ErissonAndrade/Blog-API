import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';


async function initializeMongoServer() {
  try {
    console.log(`Connecting to DB...`)
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log('Connected!')
  }
  catch(err) {
    console.error(err);
  }
};

export default initializeMongoServer;