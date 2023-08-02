const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const dotenv  = require('dotenv/config');

const login_post = async (req, res, next) => {
    try {
        const { user, password } = req.body;
        const getUser = await User.findOne({ user });

        if (!user) {
            return res.status(401).json({
                message: 'Please log in!'
            })
        }
        if(!getUser) {
            return res.status(401).json({
                message: 'Invalid username or password.'
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
                    message: "Invalid username or password."
                })
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = {
    login_post
};