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
const initializeMongoServer = require('../../mongoconfig/mongoConfigTesting.js');
const connectToRealDb = require('../../mongoconfig/mongoConfig.js');

const app = express();

app.use(express.urlencoded({ extended: false }));

passport.use(jwtStrategy);

app.use(bodyParser.json());

app.use('/login', loginRouter)

describe('Test login routes', () => {
    beforeAll(() => {
        connectToRealDb();
    });
    afterAll(() => {
        mongoose.connection.close();
    });

    it('Succesfully logged in', (done) => {
        request(app)
            .post('/login')
            .send({ user: process.env.ADMIN_ID, password: process.env.ADMIN_PASSWORD })
            .expect(200)
            .expect((response => {
                expect(response.body.message).toBe("Authorized!");
                expect(response.body.token).toBeDefined();
            }))
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('User is empty', (done) => {
        request(app)
            .post('/login')
            .expect(401)
            .expect((response => {
                expect(response.body.message).toBe("Please log in!");
                expect(response.body.token).toBeUndefined();
            }))
            .end((err) => {
                if (err) return done(err)
                done()
            });
    });

    it('User or password is incorrect', (done) => {
        request(app)
            .post('/login')
            .send({ user: 'John', password: 'Doe' })
            .expect(401)
            .expect((response => {
                expect(response.body.message).toBe("Invalid username or password.");
                expect(response.body.token).toBeUndefined();
            }))
            .end((err) => {
                if (err) return done(err)
                done()
            });
    });
})