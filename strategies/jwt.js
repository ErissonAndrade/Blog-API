import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../models/users.js";
import dotenv from 'dotenv/config'

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

const jwtStrategy = new Strategy(opts, async(payload, done) => {
    try {
        const user = await User.findById(payload.userId);
        
        if(user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch(err) {
        return done(err, false);
    }
});

export default jwtStrategy;