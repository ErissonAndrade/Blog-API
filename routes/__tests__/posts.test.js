import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import postsRouter from '../posts.js';
import passport from 'passport';
import jwtStrategy from '../../strategies/jwt.js';
import request from 'supertest';
import Post from '../../models/posts.js';
import Comment from '../../models/comments.js';

const mongoDB = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.ifu8n0w.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
    await mongoose.connect(mongoDB, { dbName: 'blog-api' });
};

const app = express();

app.use(express.urlencoded({ extended: false }));

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.use('/posts', postsRouter);

beforeAll(() => {
    return main()
});

afterAll(() => {
    return mongoose.connection.close();
})


describe('Test routes', () => {
    it('Should return all posts', (done) => {
        request(app)
            .get('/posts')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if(err) return done(err);
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
                        if(err) return done(err);
                        done();
                    });
            }).catch((err) => {
                done(err);
            });
    });
});