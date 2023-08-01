import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import postsRouter from '../posts.js';
import loginRouter from '../login.js';
import passport from 'passport';
import jwtStrategy from '../../strategies/jwt.js';
import request from 'supertest';
import Post from '../../models/posts.js';
import Comment from '../../models/comments.js';
import connectToMockDb from '../../mongoconfig/mongoConfigTesting.js';
import connectToRealDb from '../../mongoconfig/mongoConfig.js';

const app = express();

app.use(express.urlencoded({ extended: false }));

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.use('/posts', postsRouter);

function logIn() {
    connectToRealDb();
    request(app)
        .post('/login')
        .send({user: process.env.ADMIN_ID, password: process.env.USER_ID});
    mongoose.connection.close();    
}

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

// describe('Test post route', () => {
//     beforeAll(() => {
//         logIn()
//     });
//     afterAll(() => {
//         mongoose.connection.close();
//     });

//     it('Successfully logged in, create a new post', (done) => {
//         connectToMockDb();
//         request(app)
//             .post('/posts')
//             .send({id: process.env.ADMIN_ID, password: process.env.ADMIN_PASSWORD})
//             .expect(200)
//             .expect((response) => {
//                 expect(response.body.message).toBe("Post created successfully!")
//             })
//     });
// })