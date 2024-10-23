const express = require('express');
const authRouter = express.Router();
const { signup, login } = require('../Controller/User.controller');

// Signup route
authRouter.post('/signup', signup);
authRouter.post('/login', login)

module.exports = authRouter;
