// models/Employee.ts
import mongoose from "mongoose";
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required:true },
    role: { type: String, required: true }, // e.g., "stylist", "receptionist"
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // Assigned tasks
    isClockedIn: { type: Boolean, default: false }, // for toggle state
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);