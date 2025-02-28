import logger from './logger';

// Log that caching is disabled
logger.info('Caching is disabled, running without cache');

/**
 * No-op implementation of cache set function
 * @param key Cache key
 * @param data Data to cache
 * @param expireTime Cache expiration time in seconds
 */
export const setCache = async (key: string, data: any, expireTime = 3600) => {
  // No-op implementation
  return;
};

/**
 * No-op implementation of cache get function
 * @param key Cache key
 * @returns Always returns null (cache miss)
 */
export const getCache = async (key: string) => {
  // Always return null (cache miss)
  return null;
};

/**
 * No-op implementation of cache delete function
 * @param key Cache key to delete
 */
export const deleteCache = async (key: string) => {
  // No-op implementation
  return;
};

/**
 * No-op implementation of cache clear function
 * @param pattern Pattern to match keys to clear
 */
export const clearCache = async (pattern: string) => {
  // No-op implementation
  return;
};
