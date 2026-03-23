import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import * as authService from '../services/auth.service.js';

export const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  sendSuccess(res, user, 'User registered successfully', 201);
});

export const login = catchAsync(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  sendSuccess(res, { token, user }, 'Login successful');
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.token);
  sendSuccess(res, null, 'Logged out successfully');
});

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  sendSuccess(res, user, 'User profile retrieved');
});

export const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  sendSuccess(res, null, 'Password changed successfully');
});