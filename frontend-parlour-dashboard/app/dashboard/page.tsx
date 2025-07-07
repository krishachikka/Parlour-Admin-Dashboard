'use client';

import EmployeesPage from './employee/page';
import TasksPage from './tasks/page';
import AttendanceSection from './attendance/section';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (!storedRole) {
      router.push('/login');
    } else {
      setRole(storedRole);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#fff9ec] text-[#38040e]">
      {/* Header */}
      <header className="w-full p-4 bg-[#38040e] text-[#fff9ec] flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold uppercase tracking-wide">Parlour Admin Dashboard</h1>
        {role && (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-[#fff9ec] hover:bg-[#fff9ec]/10 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </header>

      {/* Main Grid Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TasksPage />
          </div>
          <div className="lg:col-span-1">
            <EmployeesPage />
          </div>
          <div className="lg:col-span-1">
            <AttendanceSection />
          </div>
        </div>
      </div>
    </div>
  );
}