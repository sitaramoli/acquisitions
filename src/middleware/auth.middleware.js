import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided. Please sign in.',
      });
    }

    req.user = jwttoken.verify(token);
    next();
  } catch (e) {
    logger.error('Authentication error', e);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token. Please sign in again.',
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required.',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required.',
      });
    }

    next();
  } catch (e) {
    logger.error('Admin authorization error', e);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authorization check failed.',
    });
  }
};
