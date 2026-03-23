import Joi from 'joi';

export const employeeFields = {
  id: 'uuid (auto)',
  first_name: 'string, required',
  last_name: 'string, required',
  email: 'string, unique, required',
  phone: 'string, optional',
  department_id: 'uuid - departments.id',
  role_id: 'uuid - roles.id',
  hire_date: 'date, required',
  salary: 'numeric, required',
  is_active: 'boolean, default true',
  created_at: 'timestamp (auto)',
  updated_at: 'timestamp (auto)',
};

// Joi validation schema for create
export const createEmployeeSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(60).required(),
  last_name: Joi.string().trim().min(2).max(60).required(),
  email: Joi.string().email().lowercase().required(),
  phone: Joi.string().optional(),
  department_id: Joi.string().uuid().required(),
  role_id: Joi.string().uuid().required(),
  hire_date: Joi.date().required(),
  salary: Joi.number().positive().required(),
});

// Joi validation schema for update
export const updateEmployeeSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(60),
  last_name: Joi.string().trim().min(2).max(60),
  email: Joi.string().email().lowercase(),
  phone: Joi.string().optional(),
  department_id: Joi.string().uuid(),
  role_id: Joi.string().uuid(),
  hire_date: Joi.date(),
  salary: Joi.number().positive(),
});