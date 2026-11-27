const mongoose = require("mongoose");
const User = require("../models/user");
const { expressjwt } = require("express-jwt");
const passport = require('passport');


if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

const authenticateJWT = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});

const register = async(req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({"message": "All fields required"});
    }

    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email
        });
        user.setPassword(req.body.password);
        await user.save();
        const token = user.generateJWT();
        return res.status(200).json(token);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }
        return res.status(500).json({ message: "Unable to register user" });
    }
};

const login = (req, res) => {

// Validate message to ensure that email and password are present.
if (!req.body.email || !req.body.password) {
return res.status(400).json({"message": "All fields required"});
}

// Delegate authentication to passport module
passport.authenticate('local', (err, user, info) => {
if (err) {
// Error in Authentication Process
return res.status(404).json(err);
}

if (user) { // Auth succeeded - generate JWT and return to caller
const token = user.generateJWT();
res.status(200).json({token});
} 
else { // Auth failed return error
res.status(401).json(info);
}})

(req, res);
};

module.exports = {
    register,
    login,
    authenticateJWT
};