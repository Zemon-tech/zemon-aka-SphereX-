import logger from './logger';
// Keep import for type checking but don't use Redis
import Redis from 'ioredis';
import { config } from '../config/config';

// Set redis to null - no actual Redis connection
let redis: Redis | null = null;

// Log that Redis is disabled
logger.info('Redis implementation disabled, running without cache');

export const setCache = async (key: string, data: any, expireTime = 3600) => {
  // No-op implementation
  return;
};

export const getCache = async (key: string) => {
  // Always return null (cache miss)
  return null;
};

export const deleteCache = async (key: string) => {
  // No-op implementation
  return;
};

export const clearCache = async (pattern: string) => {
  // No-op implementation
  return;
};

export default redis;