const User = require('../Models/User.models');
const { CustomError, asyncHandler } = require('../Utils/Utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new CustomError('Incorrect email or password', 401));
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    });

    const userResponse = user.toObject();
    delete userResponse.__v;
    delete userResponse._id;
    delete userResponse.password

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', 
        maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
        status: 'success',
        accessToken,
        data: {
            user: userResponse
        }
    });
});
