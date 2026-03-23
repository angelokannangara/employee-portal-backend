import redis from '../config/redis.js';
import * as repo from '../repositories/role.repository.js';

const CACHE_TTL = 300;

const invalidateRoleCache = async () => {
  const { keys } = await redis.scan(0, { match: 'roles:*', count: 100 });
  if (keys.length) await redis.del(...keys);
};

export const getAllRoles = async () => {
  const cacheKey = 'roles:all';
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    console.log('📦 CACHE HIT - roles list');
    return cached;
  }
  
  console.log('💾 DB QUERY - roles list');
  const data = await repo.findAll();
  await redis.set(cacheKey, data, { ex: CACHE_TTL });
  return data;
};

export const getRoleById = async (id) => {
  const cacheKey = `roles:single:${id}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    console.log('📦 CACHE HIT - role', id);
    return cached;
  }
  
  console.log('💾 DB QUERY - role with employees', id);
  const data = await repo.findWithEmployees(id);
  await redis.set(cacheKey, data, { ex: CACHE_TTL });
  return data;
};

export const createRole = async (payload) => {
  const data = await repo.create(payload);
  await invalidateRoleCache();
  return data;
};

export const updateRole = async (id, payload) => {
  const data = await repo.update(id, payload);
  await redis.del(`roles:single:${id}`);
  await invalidateRoleCache();
  return data;
};

export const deleteRole = async (id) => {
  await repo.deleteRole(id);
  await redis.del(`roles:single:${id}`);
  await invalidateRoleCache();
};