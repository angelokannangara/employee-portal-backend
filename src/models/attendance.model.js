import Joi from 'joi';

export const attendanceFields = {
  id: 'uuid (auto)',
  employee_id: 'uuid - employees.id',
  date: 'date, required',
  check_in: 'timestamptz',
  check_out: 'timestamptz',
  hours_worked: 'numeric',
  status: 'text (present, absent, half-day, leave)',
};

export const checkInSchema = Joi.object({
  employee_id: Joi.string().uuid().required(),
  date: Joi.date().default(() => new Date()),
});

export const checkOutSchema = Joi.object({
  employee_id: Joi.string().uuid().required(),
});

export const leaveRequestSchema = Joi.object({
  employee_id: Joi.string().uuid().required(),
  date: Joi.date().required(),
  status: Joi.string().valid('leave').required(),
});