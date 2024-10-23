const CustomError = class extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const errorResponse = {
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    res.status(err.statusCode).json(errorResponse);
};

module.exports = {
    CustomError,
    asyncHandler,
    globalErrorHandler
};
