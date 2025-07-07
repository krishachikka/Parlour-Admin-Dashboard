// src/routes/employeeRoutes.ts

import express from "express";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";
import { verifyToken, isSuperAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Public for logged-in users
router.get("/", verifyToken, getAllEmployees);

// Super Admin routes
router.post("/", verifyToken, isSuperAdmin, createEmployee);
router.put("/:id", verifyToken, isSuperAdmin, updateEmployee);
router.delete("/:id", verifyToken, isSuperAdmin, deleteEmployee);
router.get("/", getAllEmployees);

export default router;