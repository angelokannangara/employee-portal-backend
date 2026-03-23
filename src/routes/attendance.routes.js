import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { checkInSchema, checkOutSchema, leaveRequestSchema } from '../models/attendance.model.js';

const router = Router();

router.use(protect);

router.get('/', attendanceController.getAll);
router.get('/employee/:employeeId', attendanceController.getByEmployee);
router.post('/check-in', validate(checkInSchema), attendanceController.checkIn);
router.post('/check-out', validate(checkOutSchema), attendanceController.checkOut);
router.post('/leave', validate(leaveRequestSchema), attendanceController.submitLeave);
router.put('/leave/:id', attendanceController.updateLeave);

export default router;