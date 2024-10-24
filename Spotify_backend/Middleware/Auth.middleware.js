const jwt = require('jsonwebtoken');
const { asyncHandler, CustomError } = require('../Utils/Utils.js');
const User = require('../Models/User.models');

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log(req.headers,"authHeader")
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findOne({ email: decoded.id });
        if (!user) {
            throw new CustomError('User not found', 404);
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new CustomError('Token expired', 401);
        }
        console.log(error,"error")
        throw new CustomError('Invalid token', 401);
    }
});

module.exports = authMiddleware;
