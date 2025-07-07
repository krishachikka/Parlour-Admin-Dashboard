// controllers/attendanceController.ts
import Attendance from '../models/Attendance';
import { Request, Response } from 'express';

export const getLatestAttendance = async (req: Request, res: Response) => {
  try {
    const records = await Attendance.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$employeeId",
          status: { $first: "$status" },
          timestamp: { $first: "$timestamp" }
        }
      }
    ]);

    res.json(records.map(r => ({
      employeeId: r._id,
      status: r.status,
      timestamp: r.timestamp
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};