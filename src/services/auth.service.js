import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../config/redis.js';
import * as authRepo from '../repositories/auth.repository.js';
import AppError from '../utils/AppError.js';

export const register = async ({ name, email, password }) => {
  // Check if user exists
  const exists = await authRepo.findByEmail(email);
  if (exists) throw new AppError('Email already registered.', 409);

  // Hash password
  const hashed = await bcrypt.hash(password, 12);
  
  // Create user
  const user = await authRepo.createUser({ name, email, password: hashed });
  
  // Remove password from response
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const login = async ({ email, password }) => {
  // Find user by email
  const user = await authRepo.findByEmail(email);
  if (!user) throw new AppError('Invalid email or password.', 401);

  // Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Invalid email or password.', 401);

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return { 
    token, 
    user: { id: user.id, name: user.name, email: user.email } 
  };
};

export const logout = async (token) => {
  try {
    // Only try to blacklist if Redis is available
    if (redis && redis.set) {
      const decoded = jwt.decode(token);
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redis.set(`bl_${token}`, '1', { ex: ttl });
        console.log('Token blacklisted in Redis');
      }
    } else {
      console.log('Redis not available - token blacklist skipped');
    }
  } catch (error) {
    console.log('Logout error (non-critical):', error.message);
  }
};

export const getMe = async (userId) => {
  const user = await authRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await authRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) throw new AppError('Current password is incorrect.', 401);

  const hashed = await bcrypt.hash(newPassword, 12);
  await authRepo.updatePassword(userId, hashed);
};