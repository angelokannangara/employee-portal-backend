import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import * as roleService from '../services/role.service.js';

export const getAll = catchAsync(async (req, res) => {
  const data = await roleService.getAllRoles();
  sendSuccess(res, data, 'Roles retrieved successfully');
});

export const getById = catchAsync(async (req, res) => {
  const data = await roleService.getRoleById(req.params.id);
  sendSuccess(res, data, 'Role retrieved successfully');
});

export const create = catchAsync(async (req, res) => {
  const data = await roleService.createRole(req.body);
  sendSuccess(res, data, 'Role created successfully', 201);
});

export const update = catchAsync(async (req, res) => {
  const data = await roleService.updateRole(req.params.id, req.body);
  sendSuccess(res, data, 'Role updated successfully');
});

export const remove = catchAsync(async (req, res) => {
  await roleService.deleteRole(req.params.id);
  sendSuccess(res, null, 'Role deleted successfully');
});