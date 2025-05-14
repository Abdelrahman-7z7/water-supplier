const AppError = require('../utils/appError');

// 🔁 Duplicate field violation (PostgreSQL code 23505)
const handleDuplicateFieldSupabase = err => {
    const details = err.details || '';
    const match = details.match(/\((.*?)\)=\((.*?)\)/); // Extract field and value

    if (match) {
        const field = match[1];
        const value = match[2];
        const message = `The ${field} '${value}' is already taken.`;
        return new AppError(message, 400);
    }

    return new AppError('Duplicate field value. Please use another value!', 400);
};

// 🧾 General Supabase client error (PostgREST)
const handleGeneralSupabaseError = err => {
    const message = err.message || 'Supabase error occurred.';
    const details = err.details ? ` (${err.details})` : '';
    const hint = err.hint ? ` Hint: ${err.hint}` : '';
    return new AppError(`${message}${details}${hint}`, err.status || 400);
};

// 🔐 Auth API Errors (e.g., from supabase.auth.signUp)
const handleAuthApiError = err => {
    const message = err.message || 'Authentication error.';
    return new AppError(message, err.status || 401);
};

// 🔐 JWT
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Token expired. Please log in again.', 401);

// 📁 Multer
const handleMulterError = err => {
    let message = 'An error occurred during file upload.';
    if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'File size exceeds the maximum limit of 10MB.';
    } else if (err.code === 'LIMIT_FILE_TYPE') {
        message = err.field;
    }
    return new AppError(message, 400);
};

// 🌍 Send error in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        code: err.code || null,
        details: err.details || null,
        hint: err.hint || null,
        stack: err.stack
    });
};

// 🚀 Send error in production
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};

// 🌐 Global Error Middleware
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const env = process.env.NODE_ENV?.trim() || 'development';

    if (env === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.name = err.name;
        error.message = err.message;
        error.details = err.details;
        error.hint = err.hint;
        error.code = err.code;

        if (error.code === '23505') error = handleDuplicateFieldSupabase(error);
        if (error.name === 'AuthApiError') error = handleAuthApiError(error);
        if (error.message?.toLowerCase().includes('supabase')) error = handleGeneralSupabaseError(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (error.name === 'MulterError') error = handleMulterError(error);

        sendErrorProd(error, res);
    }
};
