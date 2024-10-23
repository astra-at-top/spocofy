const User = require('../Models/User.models');
const { CustomError, asyncHandler } = require('../Utils/Utils');
const jwt = require('jsonwebtoken');

exports.signup = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new CustomError('User already exists with this email', 400));
    }

    const newUser = await User.create({
        email,
        password
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new CustomError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new CustomError('Incorrect email or password', 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    user.password = undefined;

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
});
