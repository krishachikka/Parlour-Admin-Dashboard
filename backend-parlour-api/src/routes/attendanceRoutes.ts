// routes/attendanceRoutes.ts
import express from 'express';
import { getLatestAttendance } from '../controllers/attendanceController';

const router = express.Router();

router.get('/', getLatestAttendance);

export default router;