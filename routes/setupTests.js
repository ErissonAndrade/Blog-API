const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv/config');
const postsRouter = require('./posts.js');
const loginRouter = require('./login.js');
const commentsRouter = require('./comments.js');
const passport = require('passport');
const jwtStrategy = require('../strategies/jwt.js');
const request = require('supertest');
const Post = require('../models/posts.js');
const Comment = require('../models/comments.js');
const User = require('../models/users.js');
const connectToMockDb = require('../mongoconfig/mongoConfigTesting.js');
const connectToRealDb = require('../mongoconfig/mongoConfig.js');

const app = express();

app.use(express.urlencoded({ extended: false }));

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.use('/login', loginRouter);

app.use('/posts', postsRouter);

app.use('/posts/:postId/comments', commentsRouter);

const testUser = 'TestUser';
const testPassword = 'testpassword';

async function logInAndGetToken() {
    const response = await request(app)
        .post('/login')
        .send({ user: testUser, password: testPassword })
        .expect(200);
    
    return response.body.token;
};

async function createMockUser() {
    const newUser = new User({
        user: testUser,
        password: testPassword
    })
    await newUser.save();
};

async function createMockPost() {
    const newPost = new Post({
        title: 'Test title',
        text: 'Test text',
        date: new Date()
    })
    await newPost.save()

    return newPost;
};

module.exports = {
    testUser,
    testPassword,
    logInAndGetToken,
    createMockUser,
    createMockPost,
    app
}