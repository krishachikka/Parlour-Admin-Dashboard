// src/controllers/employeeController.ts

import { Request, Response } from "express";
import Employee from "../models/Employee";

// GET all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE employee (Super Admin only)
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: "Error creating employee" });
  }
};

// UPDATE employee (Super Admin only)
export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating employee" });
  }
};

// DELETE employee (Super Admin only)
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee" });
  }
};