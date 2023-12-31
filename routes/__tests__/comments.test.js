const mongoose = require('mongoose');
const request = require('supertest');
const connectToMockDb = require('../../mongoconfig/mongoConfigTesting');
const connectToRealDb = require('../../mongoconfig/mongoConfig');
const Post = require('../../models/posts');
const Comment = require('../../models/comments');
const { createMockPost, createMockUser, app, logInAndGetToken } = require('../setupTests.js');

async function getPostId() {
    const getPost = await Post.findOne();
    return getPost._id
};

async function getCommentId() {
    const getPost = await Post.findOne().populate('comments');
    const getComment = getPost.comments;
    const commentId = getComment[0]._id;
    return commentId
};

describe('Comments get routes', () => {
    let postId
    let commentId

    beforeAll(async () => {
        await connectToRealDb();
        postId = await getPostId();
        commentId = await getCommentId();
    });

    afterAll(() => {
        mongoose.connection.close();
    })

    it('Get all comments from a post', (done) => {
        request(app)
            .get(`/posts/${postId}/comments`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if(err) return done(err)
                done()
            })
    });

    it('Get a specific coment from a post', (done) => {
        request(app)
            .get(`/posts/${postId}/comments/${commentId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if(err) return done(err)
                done()
            })
    });
});

describe('Comments CRUD operations', () => {
    let postId
    let commentId
    let token

    beforeAll(async () => {
        await connectToMockDb();
        await createMockUser();
        await createMockPost();
        token = await logInAndGetToken();
        postId = await getPostId();
        commentId = await getCommentId();
    });

    afterAll(() => {
        mongoose.connection.close();
    });

    it('Create a comment in a post', (done) => {
        request(app)
            .post(`/posts/${postId}/comments`)
            .send({user: 'User test', message: 'Test message', date: new Date()})
            .expect(200)
            .expect((response) => {
                expect(response.body.message).toBe('Comment created successfully!')
            })
            .end((err) => {
                if(err) return done(err)
                done()
            })
    });

    it('Update a comment in a post', (done) => {
        request(app)
            .put(`/posts/${postId}/comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({user: 'User updated', message: 'Test message updated'})
            .expect(200)
            .expect((response) => {
                expect(response.body.message).toBe('Comment updated successfully!')
            })
            .end((err) => {
                if(err) return done(err)
                done()
            })
    });

    it('Delete a comment in a post', (done) => {
        request(app)
            .delete(`/posts/${postId}/comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.message).toBe('Comment deleted successfully!')
            })
            .end((err) => {
                if(err) return done(err)
                done()
            })
    });
})