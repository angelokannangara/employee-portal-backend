import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import * as employeeService from '../services/employee.service.js';

export const getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const data = await employeeService.getAllEmployees(page, limit);
  sendSuccess(res, data, 'Employees retrieved successfully');
});

export const getById = catchAsync(async (req, res) => {
  const data = await employeeService.getEmployeeById(req.params.id);
  sendSuccess(res, data, 'Employee retrieved successfully');
});

export const getByDepartment = catchAsync(async (req, res) => {
  const data = await employeeService.getEmployeesByDepartment(req.params.deptId);
  sendSuccess(res, data, 'Employees by department retrieved successfully');
});

export const create = catchAsync(async (req, res) => {
  const data = await employeeService.createEmployee(req.body);
  sendSuccess(res, data, 'Employee created successfully', 201);
});

export const update = catchAsync(async (req, res) => {
  const data = await employeeService.updateEmployee(req.params.id, req.body);
  sendSuccess(res, data, 'Employee updated successfully');
});

export const remove = catchAsync(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  sendSuccess(res, null, 'Employee deactivated successfully');
});