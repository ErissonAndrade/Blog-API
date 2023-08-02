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
const connectToMockDb = require('../../mongoconfig/mongoConfigTesting.js');
const connectToRealDb = require('../../mongoconfig/mongoConfig.js');

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