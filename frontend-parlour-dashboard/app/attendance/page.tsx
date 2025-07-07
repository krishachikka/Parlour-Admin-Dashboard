'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Employee {
  _id: string;
  name: string;
  role: string;
}

interface Attendance {
  employeeId: string | { _id: string };
  status: 'in' | 'out';
  timestamp: string;
}

function highlightMatch(text: string, search: string) {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={i} className="bg-rose-300 font-semibold">{part}</mark>
    ) : (
      part
    )
  );
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Attendance>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data: Attendance[] = await res.json();
        const map: Record<string, Attendance> = {};
        data.forEach((entry) => {
          const empId =
            typeof entry.employeeId === 'string'
              ? entry.employeeId
              : entry.employeeId._id;
          map[empId] = {
            ...entry,
            employeeId: empId,
          };
        });
        setAttendanceMap(map);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };

    fetchEmployees();
    fetchAttendance();

    // Socket.IO setup
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('attendanceUpdate', (updated: Attendance) => {
      const empId =
        typeof updated.employeeId === 'string'
          ? updated.employeeId
          : updated.employeeId._id;

      setAttendanceMap((prev) => ({
        ...prev,
        [empId]: {
          employeeId: empId,
          status: updated.status,
          timestamp: updated.timestamp,
        },
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePunch = (employeeId: string) => {
    const currentStatus = attendanceMap[employeeId]?.status || 'out'; // Default to 'out'
    const newStatus = currentStatus === 'in' ? 'out' : 'in';

    if (socketRef.current) {
      socketRef.current.emit('punch', { employeeId, status: newStatus });
    } else {
      console.error('Socket not connected');
    }
  };

  return (
    <section>
      <header className="w-full p-4 bg-[#38040e] text-[#fff9ec] flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold uppercase tracking-wide">Parlour Attendance Punch</h1>
      </header>

      <div className="p-6 space-y-6 mx-auto">
        <Input
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md bg-white border-4 border-[#A78A7F]"
        />

        <div className="grid lg:grid-cols-4 gap-4">
          {employees
            .filter((emp) => {
              const searchable = `${emp.name} ${emp.role}`.toLowerCase();
              return searchable.includes(searchTerm.toLowerCase());
            })
            .map((emp) => {
              const attendance = attendanceMap[emp._id];
              const status = attendance?.status ?? 'out'; // Default to 'out' if undefined

              let formattedTime: string | null = null;
              if (attendance?.timestamp && !isNaN(Date.parse(attendance.timestamp))) {
                formattedTime = new Date(attendance.timestamp).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });
              }

              return (
                <div
                  key={emp._id}
                  className="p-6 border-5 rounded-xl flex flex-col gap-2 shadow border-[#E7D7C1] bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold">{highlightMatch(emp.name, searchTerm)}</p>
                      <i><p className="text-lg text-red-950/70">{highlightMatch(emp.role, searchTerm)}</p></i>
                    </div>
                    <Button
                      onClick={() => handlePunch(emp._id)}
                      variant={status === 'in' ? 'destructive' : 'default'}
                      className={`cursor-pointer ${status === 'in' ? 'bg-red-950 hover:bg-red-800' : 'hover:bg-[#766461] bg-[#a98d6f]'} text-white lg:text-lg`}
                    >
                      {status === 'in' ? 'Punch Out' : 'Punch In'}
                    </Button>
                  </div>

                  {formattedTime && (
                    <p className="text-md text-red-950/80">
                      Last <b>punched {status}</b> at <i>{formattedTime}</i>
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}