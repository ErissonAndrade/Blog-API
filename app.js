const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv/config');
const commentsRouter = require('./routes/comments.js');
const postsRouter = require('./routes/posts.js');
const loginRouter = require('./routes/login.js');
const passport = require('passport');
const jwtStrategy = require('./strategies/jwt.js');
const cors = require('cors');
const connectToDb = require( './mongoconfig/mongoConfig.js');

const app = express();

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("Home Page")
});

app.use("/login", loginRouter);

app.use("/posts", postsRouter);

app.use("/posts/:postId/comments", commentsRouter);

const port = 5000;

async function main() {
    try {
        await connectToDb();

        app.listen(port, () => {
            console.log(`App listening on port ${port}!`)
        });
    }
    catch(err) {
        console.error(err);
    }
};

main();

