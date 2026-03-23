import supabase from '../config/supabase.js';
import AppError from '../utils/AppError.js';

const TABLE = 'departments';

export const findAll = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*');

    if (error) {
      console.error('Error in findAll departments:', error);
      throw new AppError(error.message, 500);
    }
    return data || [];
  } catch (error) {
    console.error('Exception in findAll departments:', error);
    throw error;
  }
};

export const findById = async (id) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error in findById department:', error);
      throw new AppError(error.message, 500);
    }
    
    if (!data) {
      throw new AppError('Department not found', 404);
    }
    
    return data;
  } catch (error) {
    console.error('Exception in findById department:', error);
    throw error;
  }
};

export const create = async (payload) => {
  try {
    console.log('Creating department with payload:', payload);
    
    const { data, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error in create department:', error);
      throw new AppError(error.message, 500);
    }
    
    console.log('Department created successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception in create department:', error);
    throw error;
  }
};

export const update = async (id, payload) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error in update department:', error);
      throw new AppError(error.message, 500);
    }
    
    if (!data) {
      throw new AppError('Department not found or update failed', 404);
    }
    
    return data;
  } catch (error) {
    console.error('Exception in update department:', error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    // First check if there are employees in this department
    const { count, error: countError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('department_id', id)
      .eq('is_active', true);

    if (countError) {
      console.error('Error checking employees:', countError);
      throw new AppError(countError.message, 500);
    }
    
    if (count > 0) {
      throw new AppError('Cannot delete department with active employees', 400);
    }

    // If no employees, delete the department
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting department:', error);
      throw new AppError(error.message, 500);
    }
  } catch (error) {
    console.error('Exception in deleteDepartment:', error);
    throw error;
  }
};