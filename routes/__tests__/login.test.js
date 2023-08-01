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
import initializeMongoServer from '../../mongoconfig/mongoConfigTesting.js';
import connectToRealDb from '../../mongoconfig/mongoConfig.js';

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