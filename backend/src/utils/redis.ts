import Redis from 'ioredis';
import logger from './logger';
import { config } from '../config/config';

let redis: Redis | null = null;

try {
  redis = new Redis({
    host: config.redis.host || 'localhost',
    port: config.redis.port || 6379,
    password: config.redis.password || undefined,
  });

  redis.on('error', (error: Error) => {
    logger.error('Redis connection error:', error);
    redis = null;
  });

  redis.on('connect', () => {
    logger.info('Redis connected successfully');
  });
} catch (error) {
  logger.warn('Redis not available, running without cache');
  redis = null;
}

export const setCache = async (key: string, data: any, expireTime = 3600) => {
  if (!redis) return;
  try {
    await redis.setex(key, expireTime, JSON.stringify(data));
  } catch (error) {
    logger.error('Redis set cache error:', error);
  }
};

export const getCache = async (key: string) => {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis get cache error:', error);
    return null;
  }
};

export const deleteCache = async (key: string) => {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (error) {
    logger.error('Redis delete cache error:', error);
  }
};

export const clearCache = async (pattern: string) => {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.error('Redis clear cache error:', error);
  }
};

export default redis; 