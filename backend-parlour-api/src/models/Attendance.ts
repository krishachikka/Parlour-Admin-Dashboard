// models/Attendance.ts
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  status: { type: String, enum: ['in', 'out'], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Attendance', attendanceSchema);
