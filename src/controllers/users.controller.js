import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';
import { formatValidationError } from '#utils/format.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users...');
    const allUsers = await getAllUsers();
    res.status(200).json({
      count: allUsers.length,
      users: allUsers,
    });
  } catch (e) {
    logger.error('Failed to get all users', e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    logger.info(`Fetching user by id: ${id}`);
    const user = await getUserById(id);

    res.status(200).json({
      user,
    });
  } catch (e) {
    logger.error('Failed to get user by id', e);
    if (e.message === 'User not found') {
      return res.status(404).json({ error: e.message });
    }
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Validate params
    const paramsValidation = userIdSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramsValidation.error),
      });
    }

    // Validate body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = paramsValidation.data;
    const updates = bodyValidation.data;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Authorization checks
    const isOwnProfile = req.user.id === id;
    const isAdmin = req.user.role === 'admin';

    // Users can only update their own profile, admins can update any profile
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile',
      });
    }

    // Only admins can change roles
    if (updates.role && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can change user roles',
      });
    }

    logger.info(`Updating user ${id}`);
    const updatedUser = await updateUser(id, updates);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error('Failed to update user', e);
    if (e.message === 'User not found') {
      return res.status(404).json({ error: e.message });
    }
    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: e.message });
    }
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Authorization checks
    const isOwnProfile = req.user.id === id;
    const isAdmin = req.user.role === 'admin';

    // Users can delete their own profile, admins can delete any profile
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own profile',
      });
    }

    logger.info(`Deleting user ${id}`);
    const deletedUser = await deleteUser(id);

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (e) {
    logger.error('Failed to delete user', e);
    if (e.message === 'User not found') {
      return res.status(404).json({ error: e.message });
    }
    next(e);
  }
};
