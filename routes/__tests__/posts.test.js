const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv/config');
const postsRouter = require('../posts.js');
const loginRouter = require('../login.js');
const passport = require('passport');
const jwtStrategy = require('../../strategies/jwt.js');
const request = require('supertest');
const Post = require('../../models/posts.js');
const Comment = require('../../models/comments.js');
const User = require('../../models/users.js');
const connectToMockDb = require('../../mongoconfig/mongoConfigTesting.js');
const connectToRealDb = require('../../mongoconfig/mongoConfig.js');

const app = express();

app.use(express.urlencoded({ extended: false }));

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.use('/login', loginRouter);

app.use('/posts', postsRouter);

const testUser = 'TestUser';
const testPassword = 'testpassword';

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

async function logInAndGetToken() {
    const response = await request(app)
        .post('/login')
        .send({ user: testUser, password: testPassword })
        .expect(200);
    
    return response.body.token;
};

describe('Test get routes', () => {
    beforeAll(() => {
        connectToRealDb();
    })
    afterAll(() => {
        mongoose.connection.close();
    })

    it('Should return all posts', (done) => {
        request(app)
            .get('/posts')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
    
    it('Should return a specific post', (done) => {
        Post.findOne()
            .then((response) => {
                const postId = response._id;
                request(app)
                    .get(`/posts/${postId}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            }).catch((err) => {
                if(err) return done(err);
                done(err);
            });
    });
});

describe('Test crud operations', () => {
    let token; 
    let post;

    beforeAll(async () => {
        await connectToMockDb();
        await createMockUser();
        post = await createMockPost();
        token = await logInAndGetToken(); 
    });

    afterAll(() => {
        mongoose.connection.close();
    });

    it('Create a new post', (done) => {
        request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)    
            .send({ title: 'Test title', text: 'Test text' })
            .expect(200)
            .expect((response) => {
                expect(response.body.message).toBe('Post created successfully!');
            })
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('Update the post', (done) => {
        request(app)
            .put(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Update test title', text: 'Update test text'})
            .expect(200)
            .expect((response) => {
                expect(response.body.message).toBe('Post updated successfully')
            })
            .end((err) => {
                if(err) return done(err)
                done()
            });     
    });

    it('Delete the post', (done) => {
        request(app)
            .delete(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.message).toBe('Post deleted successfully')
            })
            .end((err) => {
                if(err) return done(err)
                done()
            });
    });
});