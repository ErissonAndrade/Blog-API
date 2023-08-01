import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv/config';
import commentsRouter from './routes/comments.js';
import postsRouter from './routes/posts.js';
import loginRouter from './routes/login.js';
import passport from 'passport';
import jwtStrategy from './strategies/jwt.js';
import cors from 'cors';
import connectToRealDb from './mongoconfig/mongoConfig.js';

const app = express();

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("Home Page")
});

app.use("/login", loginRouter);

app.use("/posts", postsRouter);

app.use("/posts/:postId/comments", commentsRouter)

const port = 5000;

async function main() {
    try {
        await connectToRealDb();

        app.listen(port, () => {
            console.log(`App listening on port ${port}!`)
        });
    }
    catch(err) {
        console.error(err);
    }
};

main();

