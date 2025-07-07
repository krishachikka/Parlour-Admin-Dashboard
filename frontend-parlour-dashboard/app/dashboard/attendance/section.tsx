'use client';

import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Employee {
  _id: string;
  name: string;
  role: string;
}

interface Attendance {
  employeeId: string | { _id: string };
  status: 'in' | 'out';
  time: string;
}

export default function AttendanceSection() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Attendance>>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchEmployees = async () => {
      const res = await fetch('http://localhost:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setEmployees(data);
    };

    const fetchAttendance = async () => {
      const res = await fetch('http://localhost:5000/api/attendance', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: Attendance[] = await res.json();
      const map: Record<string, Attendance> = {};
      data.forEach((entry) => {
        const id = typeof entry.employeeId === 'string' ? entry.employeeId : entry.employeeId._id;
        map[id] = { ...entry, employeeId: id };
      });
      setAttendanceMap(map);
    };

    fetchEmployees();
    fetchAttendance();

    const socket = io('http://localhost:5000', {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('attendanceUpdate', (update: Attendance) => {
      const id = typeof update.employeeId === 'string' ? update.employeeId : update.employeeId._id;

      // Update map
      setAttendanceMap((prev) => ({
        ...prev,
        [id]: {
          employeeId: id,
          status: update.status,
          time: update.time,
        },
      }));

      // Reorder employee list to bring updated to top
      setEmployees((prev) => {
        const updated = prev.find((e) => e._id === id);
        const others = prev.filter((e) => e._id !== id);
        return updated ? [updated, ...others] : prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Split employees
  const punchedIn = employees
    .filter((emp) => attendanceMap[emp._id]?.status === 'in')
    .sort((a, b) => {
      const timeA = new Date(attendanceMap[a._id]?.time || 0).getTime();
      const timeB = new Date(attendanceMap[b._id]?.time || 0).getTime();
      return timeB - timeA;
    });

  const punchedOut = employees
    .filter((emp) => attendanceMap[emp._id]?.status !== 'in')
    .sort((a, b) => {
      const timeA = new Date(attendanceMap[a._id]?.time || 0).getTime();
      const timeB = new Date(attendanceMap[b._id]?.time || 0).getTime();
      return timeB - timeA;
    });

  const renderCard = (emp: Employee) => {
    const attendance = attendanceMap[emp._id];
    const status = attendance?.status || 'out';

    let timeFormatted = '';
    if (attendance?.time && !isNaN(Date.parse(attendance.time))) {
      const date = new Date(attendance.time);
      timeFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    return (
      <div
        key={emp._id}
        className="flex justify-between items-center border-4 p-4 rounded-xl shadow bg-white border-[#E7D7C1]"
      >
        <div>
          <p className="font-medium">{emp.name}</p>
          <p className="text-sm text-gray-500">{emp.role}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold px-2 py-1 rounded-full ${status === 'in' ? 'bg-green-200' : 'bg-red-300/70'}`}>
            {status === 'in' ? 'Punched In' : 'Punched Out'}
          </p>
          {timeFormatted && (
            <p className="text-xs text-gray-400">at {timeFormatted}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Live Attendance</h2>
    
    
    <h3 className="text-xl font-bold bg-[#E7D7C1] rounded-full p-1 px-3 w-fit">Currently In</h3>
      {punchedIn.length > 0 && (
      <div className="max-h-[35vh] overflow-y-auto pr-2 space-y-4">
          {punchedIn.map(renderCard)}
        </div>
      )}
    
    <h3 className="text-xl font-bold bg-[#E7D7C1] rounded-full p-1 px-3 w-fit">Currently Out</h3>
      {punchedOut.length > 0 && (
      <div className="h-[40vh] overflow-y-auto pr-2 space-y-4">
          {punchedOut.map(renderCard)}
        </div>
      )}
    </section>
  );
}
