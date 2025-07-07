import { Request, Response } from 'express';
import Task from '../models/Task';

// GET all tasks (accessible to Admin & Super Admin)
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email role');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// CREATE task (Super Admin only)
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;
    const newTask = await Task.create({ title, description, assignedTo, status, dueDate });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err });
  }
};

// UPDATE task (Super Admin only)
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err });
  }
};

// DELETE task (Super Admin only)
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err });
  }
};