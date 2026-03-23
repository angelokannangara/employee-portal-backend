import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

let redis = null;

// Check if Redis credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('✅ Redis client initialized');
  } catch (error) {
    console.warn('⚠️ Redis initialization failed:', error.message);
    redis = null;
  }
} else {
  console.log('⚠️ Redis credentials not provided - caching disabled');
}

// Create a mock Redis client that does nothing (prevents errors)
const mockRedis = {
  get: async () => null,
  set: async () => {},
  del: async () => {},
  scan: async () => ({ keys: [] })
};

// Export the real Redis if available, otherwise export mock
export default redis || mockRedis;