import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import dotenv from 'dotenv/config'

const login_post = async (req, res, next) => {
    try {
        const { user, password } = req.body;
        const getUser = await User.findOne({ user });

        if (!user) {
            return res.status(401).json({
                message: "Please log in!"
            })
        }

        bcrypt.compare(password, getUser.password, async (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    message: `${error}`
                });
            }
            if (result) {
                const opts = {};
                opts.expiresIn = '2d';
                const token = jwt.sign({ userId: getUser._id }, process.env.SECRET_KEY, opts)
                return res.status(200).json({
                    message: "Authorized!",
                    token
                })
            }
            else {
                return res.status(401).json({
                    message: "Invalid username or password"
                })
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export default {
    login_post
};