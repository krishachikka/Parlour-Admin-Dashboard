import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController';
import { verifyToken, isSuperAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', verifyToken, getAllTasks); // All roles
router.post('/', verifyToken, isSuperAdmin, createTask);
router.put('/:id', verifyToken, isSuperAdmin, updateTask);
router.delete('/:id', verifyToken, isSuperAdmin, deleteTask);

export default router;