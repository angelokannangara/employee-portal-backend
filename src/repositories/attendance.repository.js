import supabase from '../config/supabase.js';
import AppError from '../utils/AppError.js';

const TABLE = 'attendance';

export const findAll = async (startDate, endDate) => {
  let query = supabase
    .from(TABLE)
    .select('*, employees(first_name, last_name)');

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw new AppError(error.message, 500);
  return data;
};

export const findByEmployee = async (employeeId, startDate, endDate) => {
  let query = supabase
    .from(TABLE)
    .select('*')
    .eq('employee_id', employeeId);

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw new AppError(error.message, 500);
  return data;
};

export const findTodayRecord = async (employeeId) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('employee_id', employeeId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw new AppError(error.message, 500);
  }
  
  return data;
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
    .update(payload)
    .eq('id', id)
    .select();

  if (error || !data.length) {
    throw new AppError('Attendance record not found or update failed', 404);
  }
  return data[0];
};