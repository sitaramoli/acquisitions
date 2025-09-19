import express from 'express';
import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes except getting all users
router.get('/', fetchAllUsers);
router.get('/:id', authMiddleware, fetchUserById);
router.put('/:id', authMiddleware, updateUserById);
router.delete('/:id', authMiddleware, deleteUserById);

export default router;
