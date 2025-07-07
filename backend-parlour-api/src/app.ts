import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import tasksRoutes from "./routes/taskRoutes";
import attendanceRoutes from "./routes/attendanceRoutes"

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/employees", employeeRoutes)
app.use("/api/tasks", tasksRoutes)
app.use('/api/attendance', attendanceRoutes);

export default app;