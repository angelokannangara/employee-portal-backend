import * as repo from '../repositories/attendance.repository.js';
import AppError from '../utils/AppError.js';

export const getAllAttendance = async (startDate, endDate) => {
  return await repo.findAll(startDate, endDate);
};

export const getEmployeeAttendance = async (employeeId, startDate, endDate) => {
  return await repo.findByEmployee(employeeId, startDate, endDate);
};

export const checkIn = async (employeeId, date) => {
  // Check if already checked in today
  const existing = await repo.findTodayRecord(employeeId);
  if (existing && existing.check_in) {
    throw new AppError('Already checked in today', 400);
  }

  const now = new Date().toISOString();
  const payload = {
    employee_id: employeeId,
    date: date || new Date().toISOString().split('T')[0],
    check_in: now,
    status: 'present',
  };

  if (existing && !existing.check_in) {
    return await repo.update(existing.id, payload);
  }

  return await repo.create(payload);
};

export const checkOut = async (employeeId) => {
  const record = await repo.findTodayRecord(employeeId);
  if (!record || !record.check_in) {
    throw new AppError('No check-in record found for today', 400);
  }
  if (record.check_out) {
    throw new AppError('Already checked out today', 400);
  }

  const checkOutTime = new Date();
  const checkInTime = new Date(record.check_in);
  const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

  const payload = {
    check_out: checkOutTime.toISOString(),
    hours_worked: Math.round(hoursWorked * 100) / 100,
  };

  return await repo.update(record.id, payload);
};

export const submitLeave = async (employeeId, date, status) => {
  // Check if already has record for this date
  const existing = await repo.findByEmployee(employeeId, date, date);
  
  if (existing && existing.length > 0) {
    return await repo.update(existing[0].id, { status: 'leave' });
  }
  
  const payload = {
    employee_id: employeeId,
    date,
    status: 'leave',
  };
  
  return await repo.create(payload);
};

export const updateLeaveStatus = async (id, status) => {
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }
  
  return await repo.update(id, { status });
};