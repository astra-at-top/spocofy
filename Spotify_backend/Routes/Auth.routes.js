const express = require('express');
const authRouter = express.Router();
const authMiddleware = require("../Middleware/Auth.middleware.js")
const { signup, login, refreshToken, verifyToken, logout, test } = require('../Controller/User.controller');

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.get('/verify', verifyToken);
authRouter.post('/logout', authMiddleware , logout);
authRouter.post('/test', authMiddleware, test)

module.exports = authRouter;
