import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";
import Attendance from './models/Attendance';

dotenv.config();
connectDB();

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

export { io };

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('punch', async ({ employeeId, status }) => {
    const attendance = await Attendance.create({ employeeId, status });
    const populated = await attendance.populate('employeeId', 'name role');
    io.emit('attendanceUpdate', populated); // notify all dashboards
  });
});

// io.on("connection", (socket) => {
//   console.log("New WebSocket connection 🔌");
// });

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
