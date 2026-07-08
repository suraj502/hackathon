import { Error as MongooseError } from 'mongoose';
import jwt from 'jsonwebtoken';

import { AppError } from '../utils/AppError.js';

const buildErrorResponse = (message, errors = []) => ({
  success: false,
  message,
  errors,
});

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let errors = Array.isArray(error.errors) ? error.errors : [];

  if (error instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(error.errors).map((fieldError) => fieldError.message);
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
    errors = ['The provided id is invalid'];
  }

  if (error.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(error.keyValue || {});
    message = 'Duplicate key error';
    errors = fields.length > 0 ? [`Duplicate value for ${fields.join(', ')}`] : ['Duplicate value detected'];
  }

  if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Invalid or expired token';
    errors = ['Authentication failed'];
  }

  if (statusCode >= 500 && process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return res.status(statusCode).json(buildErrorResponse(message, errors));
};
