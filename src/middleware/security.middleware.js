import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

export const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = `Admin limit exceeded ${limit} requests per minutes. Slow down.`;
        break;
      case 'user':
        limit = 10;
        message = `User limit exceeded ${limit} requests per minutes. Slow down.`;
        break;
      case 'guest':
        limit = 5;
        message = `Guest limit exceeded ${limit} requests per minutes. Slow down.`;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );
    const decision = await client.protect(req);
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      res.status(403).json({
        error: 'Forbidden',
        message: 'Bots are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy.',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      res.status(403).json({
        error: 'Too many requests',
        message,
      });
    }

    next();
  } catch (e) {
    logger.error('Security middleware error', e);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};
