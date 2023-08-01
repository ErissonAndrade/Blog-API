import mongoose from 'mongoose';

const mongoDB = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.ifu8n0w.mongodb.net/?retryWrites=true&w=majority`;

async function connectToRealDataBase() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(mongoDB, { useNewUrlParser: true, dbName: 'blog-api' });
        console.log('Successfully connected to DB!');
    }
    catch(err) {
        console.error(err)
    }
};

export default connectToRealDataBase;
