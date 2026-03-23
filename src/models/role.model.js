import Joi from 'joi';

export const roleFields = {
  id: 'uuid (auto)',
  title: 'string, unique, required',
  description: 'string, optional',
  created_at: 'timestamp (auto)',
  updated_at: 'timestamp (auto)',
};

export const createRoleSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().optional(),
});

export const updateRoleSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100),
  description: Joi.string().optional(),
});