import redis from '../config/redis.js';
import * as repo from '../repositories/department.repository.js';

const CACHE_TTL = 300; // 5 minutes

const invalidateDepartmentCache = async () => {
  try {
    const { keys } = await redis.scan(0, { match: 'departments:*', count: 100 });
    if (keys && keys.length) {
      await redis.del(...keys);
      console.log('Department cache invalidated');
    }
  } catch (error) {
    console.log('Cache invalidation error:', error.message);
  }
};

export const getAllDepartments = async () => {
  try {
    const cacheKey = 'departments:all';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      console.log('📦 CACHE HIT - departments list');
      return cached;
    }
  } catch (error) {
    console.log('Cache read error:', error.message);
  }
  
  console.log('💾 DB QUERY - departments list');
  const data = await repo.findAll();
  
  try {
    const cacheKey = 'departments:all';
    await redis.set(cacheKey, data, { ex: CACHE_TTL });
  } catch (error) {
    console.log('Cache write error:', error.message);
  }
  
  return data;
};

export const getDepartmentById = async (id) => {
  try {
    const cacheKey = `departments:single:${id}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      console.log('📦 CACHE HIT - department', id);
      return cached;
    }
  } catch (error) {
    console.log('Cache read error:', error.message);
  }
  
  console.log('💾 DB QUERY - department', id);
  const data = await repo.findById(id);
  
  // Get employee count for this department
  try {
    const supabase = (await import('../config/supabase.js')).default;
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('department_id', id)
      .eq('is_active', true);
    
    data.employee_count = count || 0;
  } catch (error) {
    console.log('Error getting employee count:', error.message);
    data.employee_count = 0;
  }
  
  try {
    const cacheKey = `departments:single:${id}`;
    await redis.set(cacheKey, data, { ex: CACHE_TTL });
  } catch (error) {
    console.log('Cache write error:', error.message);
  }
  
  return data;
};

export const createDepartment = async (payload) => {
  const data = await repo.create(payload);
  await invalidateDepartmentCache();
  return data;
};

export const updateDepartment = async (id, payload) => {
  const data = await repo.update(id, payload);
  try {
    await redis.del(`departments:single:${id}`);
  } catch (error) {
    console.log('Cache delete error:', error.message);
  }
  await invalidateDepartmentCache();
  return data;
};

export const deleteDepartment = async (id) => {
  await repo.deleteDepartment(id);
  try {
    await redis.del(`departments:single:${id}`);
  } catch (error) {
    console.log('Cache delete error:', error.message);
  }
  await invalidateDepartmentCache();
};