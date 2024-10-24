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

    const accessToken = jwt.sign({ id: user.email }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
    });

    const refreshToken = jwt.sign({ id: user.email }, process.env.JWT_REFRESH_SECRET, {
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


exports.refreshToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(req.cookies,"req.cookies")


    if (!refreshToken) {
        return next(new CustomError('No refresh token provided', 403));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({email : decoded.id});

    if (!user) {
        return next(new CustomError('User not found', 404));
    }
    const newAccessToken = jwt.sign({ id: user.email }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
    });

    res.status(200).json({
        status: 'success',
        accessToken: newAccessToken
    });
});

exports.verifyToken = asyncHandler(async (req, res, next) => {
    let token;
    console.log(" i am triggerd")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new CustomError('No access token provided', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) {
            return next(new CustomError('Token has expired', 401));
        }
        console.log(decoded,"decoded")
        const user = await User.findOne({ email: decoded.id });
        if (!user) {
            return next(new CustomError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            message: 'Token is valid',
            data: {
                user: {
                    email: user.email
                }
            }
        });

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new CustomError('Token has expired', 401));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new CustomError('Invalid token', 401));
        }

        return next(new CustomError('Token verification failed', 401));
    }
});



exports.logout = asyncHandler(async (req, res, next) => {
    res.clearCookie('refreshToken')
  
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  });


exports.test = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        status: 'success',
        message: 'getting  out successfully'
    });
});