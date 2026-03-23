import supabase from '../config/supabase.js';
import AppError from '../utils/AppError.js';

const TABLE = 'roles';

export const findAll = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*');

  if (error) throw new AppError(error.message, 500);
  return data;
};

export const findById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new AppError('Role not found', 404);
  return data;
};

export const findWithEmployees = async (id) => {
  const { data: role, error: roleError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (roleError) throw new AppError('Role not found', 404);

  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select('id, first_name, last_name, email')
    .eq('role_id', id)
    .eq('is_active', true);

  if (empError) throw new AppError(empError.message, 500);

  return { ...role, employees };
};

export const create = async (payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([payload])
    .select();

  if (error) throw new AppError(error.message, 500);
  return data[0];
};

export const update = async (id, payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error || !data.length) {
    throw new AppError('Role not found or update failed', 404);
  }
  return data[0];
};

export const deleteRole = async (id) => {
  // Check if there are employees with this role
  const { count, error: countError } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('role_id', id)
    .eq('is_active', true);

  if (countError) throw new AppError(countError.message, 500);
  
  if (count > 0) {
    throw new AppError('Cannot delete role with assigned employees', 400);
  }

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw new AppError(error.message, 500);
};