'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string | Employee;
}

interface Employee {
  _id: string;
  name: string;
  role: string;
}

function highlightMatch(text: string, search: string) {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={i} className="bg-pink-300 font-semibold">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function Dashboard() {
  const [role, setRole] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const isSuperAdmin = role === 'superadmin';

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || '';
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data);
    };

    const fetchTasks = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    };

    if (token) {
      fetchEmployees();
      fetchTasks();
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!title || !description || !employeeId) {
      alert('All fields are required');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, assignedTo: employeeId }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Error creating/updating task:', err);
        return;
      }

      const taskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await taskRes.json();
      setTasks(data);

      setIsOpen(false);
      setEditingId(null);
      setTitle('');
      setDescription('');
      setEmployeeId('');

      toast.success(editingId ? 'Task updated successfully.' : 'Task created successfully.');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => prev.filter(task => task._id !== id));
      toast.success('Task deleted successfully.');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    const id = typeof task.assignedTo === 'string' ? task.assignedTo : task.assignedTo._id;
    setEmployeeId(id);
    setIsOpen(true);
  };

  return (
    <div className="px-6 space-y-10">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-[#E7D7C1] rounded-full p-1 px-3">Tasks</h2>
          {isSuperAdmin && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Add Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit' : 'Add'} Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                  <Input
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {employeeId
                          ? employees.find(emp => emp._id === employeeId)?.name || 'Select Employee'
                          : 'Select Employee'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search employee..." />
                        <CommandList>
                          {employees.map(emp => (
                            <CommandItem
                              key={emp._id}
                              onSelect={() => setEmployeeId(emp._id)}
                            >
                              {emp.name} | {emp.role}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button className="w-full bg-[#38040e]" onClick={handleSubmit}>
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search bar */}
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full mb-4 bg-white border-[#E7D7C1] border-4"
        />

        <div className="h-[75vh] overflow-y-auto pr-2 space-y-4">
          {tasks
            .filter(task => {
              const assigned =
                typeof task.assignedTo === 'string'
                  ? employees.find(e => e._id === task.assignedTo)
                  : task.assignedTo;

              const searchIn = `${task.title} ${task.description} ${assigned?.name || ''} ${assigned?.role || ''}`.toLowerCase();
              return searchIn.includes(searchTerm.toLowerCase());
            })
            .map(task => {
              const assigned =
                typeof task.assignedTo === 'string'
                  ? employees.find(e => e._id === task.assignedTo)
                  : task.assignedTo;

              return (
                <div
                  key={task._id}
                  className="border-4 p-4 rounded-xl flex justify-between items-center shadow-sm bg-white border-[#E7D7C1]"
                >
                  <div>
                    <p className="font-bold text-lg">{highlightMatch(task.title, searchTerm)}</p>
                    <p className="text-sm text-red-950">{highlightMatch(task.description, searchTerm)}</p>
                    <p className="text-md text-red-950/70">
                      Assigned to:{' '}
                      <i>
                        {assigned
                          ? <>
                            {highlightMatch(assigned.name, searchTerm)} (
                            {highlightMatch(assigned.role, searchTerm)})
                          </>
                          : 'Unknown'}
                      </i>
                    </p>

                  </div>
                  {isSuperAdmin && (
                    <div className="flex gap-2">
                      <Button className="bg-[#735751] text-white" variant="outline" size="icon" onClick={() => startEdit(task)}>
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
                            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <p>This action is permanent and cannot be undone.</p>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(task._id)}>
                              Confirm Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}