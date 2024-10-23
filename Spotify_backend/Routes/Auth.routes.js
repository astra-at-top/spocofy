const express = require('express');
const authRouter = express.Router();
const { signup } = require('../Controller/User.controller');

// Signup route
authRouter.post('/signup', signup);

module.exports = authRouter;
