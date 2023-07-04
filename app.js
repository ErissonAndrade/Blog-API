import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import commentsRouter from './routes/comments.js';
import postsRouter from './routes/posts.js';
import loginRouter from './routes/login.js';
import passport from 'passport';
import jwtStrategy from './strategies/jwt.js';


const mongoDB = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.ifu8n0w.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
    console.log('Connecting to DB...');
    await mongoose.connect(mongoDB, { dbName: 'blog-api' });
    console.log('Successfully connected to DB!');
};

main().catch((err) => console.log(err));

const app = express();

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Home Page")
});

app.use("/login", loginRouter);

app.use("/posts", postsRouter);

app.use("/posts/:postId/comments", commentsRouter)

app.listen(3000);