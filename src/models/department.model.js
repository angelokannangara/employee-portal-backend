import Joi from 'joi';

export const departmentFields = {
  id: 'uuid (auto)',
  name: 'string, unique, required',
  manager_id: 'uuid - employees.id',
  created_at: 'timestamp (auto)',
  updated_at: 'timestamp (auto)',
};

export const createDepartmentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  manager_id: Joi.string().uuid().optional(),
});

export const updateDepartmentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  manager_id: Joi.string().uuid().optional(),
});