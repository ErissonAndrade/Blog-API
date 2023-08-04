const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


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

module.exports = initializeMongoServer;