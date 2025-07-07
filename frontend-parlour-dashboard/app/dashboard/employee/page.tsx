'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isClockedIn: boolean;
}

// ✅ highlightMatch utility
function highlightMatch(text: string, search: string) {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark>
    ) : (
      part
    )
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleField, setRoleField] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [role, setRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = role === 'superadmin';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || '';
    setRole(storedRole);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      toast.error('Failed to load employees.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !roleField) {
      toast.warning('All fields are required.');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/employees/${editingId}`
      : 'http://localhost:5000/api/employees';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, role: roleField }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Error:', err);
        toast.error('Failed to save employee.');
        return;
      }

      setIsOpen(false);
      setEditingId(null);
      setName('');
      setEmail('');
      setPhone('');
      setRoleField('');
      await fetchEmployees();

      toast.success(editingId ? 'Employee updated successfully.' : 'Employee created successfully.');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchEmployees();
      toast.success('Employee deleted successfully.');
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast.error('Failed to delete employee.');
    }
  };

  const startEdit = (employee: Employee) => {
    setEditingId(employee._id);
    setName(employee.name);
    setEmail(employee.email);
    setPhone(employee.phone);
    setRoleField(employee.role);
    setIsOpen(true);
  };

  return (
    <div className="px-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold bg-[#E7D7C1] rounded-full p-1 px-3">Employees</h1>
        {isSuperAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Employee</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Add'} Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                <Input placeholder="Role" value={roleField} onChange={e => setRoleField(e.target.value)} />
                <Button className="w-full bg-[#38040e]" onClick={handleSubmit}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 🔍 Search bar */}
      <Input
        placeholder="Search employees..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 bg-white border-[#E7D7C1] border-4"
      />

      <div className="h-[75vh] overflow-y-auto pr-2 space-y-4">
        {employees
          .filter(emp => {
            const searchIn = `${emp.name} ${emp.email} ${emp.phone} ${emp.role}`.toLowerCase();
            return searchIn.includes(searchTerm.toLowerCase());
          })
          .map(emp => (
            <div
              key={emp._id}
              className="border-4 p-4 rounded-xl flex justify-between items-center shadow-sm bg-white border-[#E7D7C1]"
            >
              <div>
                <p className="font-bold text-lg">{highlightMatch(emp.name, searchTerm)}</p>
                <p className="text-md font-semibold">{highlightMatch(emp.role, searchTerm)}</p>
                <i>
                  <p className="text-sm text-red-950/80">
                    {highlightMatch(emp.email, searchTerm)} | {highlightMatch(emp.phone, searchTerm)}
                  </p>
                </i>
              </div>
              {isSuperAdmin && (
                <div className="flex gap-2">
                  <Button className="bg-[#735751] text-white" variant="outline" size="icon" onClick={() => startEdit(emp)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-[#38040e]" variant="destructive" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                      </AlertDialogHeader>
                      <p>This will permanently delete the employee.</p>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(emp._id)}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}