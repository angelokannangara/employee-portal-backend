import redis from '../config/redis.js';
import * as repo from '../repositories/employee.repository.js';
import AppError from '../utils/AppError.js';

const CACHE_TTL = 300; // 5 minutes

const invalidateListCache = async () => {
  const { keys } = await redis.scan(0, { match: 'employees:list:*', count: 100 });
  if (keys.length) await redis.del(...keys);
};

export const getAllEmployees = async (page, limit) => {
  const cacheKey = `employees:list:${page}:${limit}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    console.log('📦 CACHE HIT - employees list');
    return cached;
  }
  
  console.log('💾 DB QUERY - employees list');
  const result = await repo.findAll(page, limit);
  await redis.set(cacheKey, result, { ex: CACHE_TTL });
  return result;
};

export const getEmployeeById = async (id) => {
  const cacheKey = `employees:single:${id}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    console.log('📦 CACHE HIT - employee', id);
    return cached;
  }
  
  console.log('💾 DB QUERY - employee', id);
  const data = await repo.findById(id);
  await redis.set(cacheKey, data, { ex: CACHE_TTL });
  return data;
};

export const createEmployee = async (payload) => {
  const data = await repo.create(payload);
  await invalidateListCache();
  return data;
};

export const updateEmployee = async (id, payload) => {
  const data = await repo.update(id, payload);
  await redis.del(`employees:single:${id}`);
  await invalidateListCache();
  return data;
};

export const deleteEmployee = async (id) => {
  const data = await repo.softDelete(id);
  await redis.del(`employees:single:${id}`);
  await invalidateListCache();
  return data;
};

export const getEmployeesByDepartment = async (deptId) => {
  const cacheKey = `employees:department:${deptId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    console.log('📦 CACHE HIT - department employees', deptId);
    return cached;
  }
  
  console.log('💾 DB QUERY - department employees', deptId);
  const data = await repo.findByDepartment(deptId);
  await redis.set(cacheKey, data, { ex: CACHE_TTL });
  return data;
};