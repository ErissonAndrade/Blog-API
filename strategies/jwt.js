const { Strategy, ExtractJwt } = require('passport-jwt');
const User  = require('../models/users.js');
const dotenv = require('dotenv/config');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

const jwtStrategy = new Strategy(opts, async(payload, done) => {
    try {
        const user = await User.findById(payload.userId);
        
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch(err) {
        return done(err, false);
    }
});

module.exports = jwtStrategy;