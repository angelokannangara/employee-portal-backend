import jwt from 'jsonwebtoken';
import redis from '../config/redis.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  // 1. Extract token from Authorization header
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    throw new AppError('You are not logged in. Please authenticate.', 401);
  }

  // 2. Check Redis blacklist (only if Redis is available)
  if (redis && redis.get) {
    try {
      const isBlacklisted = await redis.get(`bl_${token}`);
      if (isBlacklisted) {
        throw new AppError('Token has been revoked. Please log in again.', 401);
      }
    } catch (error) {
      // Redis error - just log and continue (blacklist check is optional)
      console.log('Redis blacklist check failed:', error.message);
    }
  }

  // 3. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  req.token = token;
  next();
});