import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import * as attendanceService from '../services/attendance.service.js';

export const getAll = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await attendanceService.getAllAttendance(startDate, endDate);
  sendSuccess(res, data, 'Attendance records retrieved successfully');
});

export const getByEmployee = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await attendanceService.getEmployeeAttendance(
    req.params.employeeId,
    startDate,
    endDate
  );
  sendSuccess(res, data, 'Employee attendance retrieved successfully');
});

export const checkIn = catchAsync(async (req, res) => {
  const { employee_id, date } = req.body;
  const data = await attendanceService.checkIn(employee_id, date);
  sendSuccess(res, data, 'Check-in successful', 201);
});

export const checkOut = catchAsync(async (req, res) => {
  const { employee_id } = req.body;
  const data = await attendanceService.checkOut(employee_id);
  sendSuccess(res, data, 'Check-out successful');
});

export const submitLeave = catchAsync(async (req, res) => {
  const { employee_id, date, status } = req.body;
  const data = await attendanceService.submitLeave(employee_id, date, status);
  sendSuccess(res, data, 'Leave request submitted successfully', 201);
});

export const updateLeave = catchAsync(async (req, res) => {
  const { status } = req.body;
  const data = await attendanceService.updateLeaveStatus(req.params.id, status);
  sendSuccess(res, data, 'Leave request updated successfully');
});