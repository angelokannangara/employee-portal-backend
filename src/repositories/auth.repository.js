import supabase from '../config/supabase.js';
import AppError from '../utils/AppError.js';

const TABLE = 'users';

export const findByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid error when no record
    
    if (error) {
      console.error('Error in findByEmail:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in findByEmail:', error);
    return null;
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
      console.error('Error in findById:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in findById:', error);
    return null;
  }
};

export const createUser = async (payload) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error in createUser:', error);
      throw new AppError(error.message, 500);
    }
    
    return data;
  } catch (error) {
    console.error('Exception in createUser:', error);
    throw error;
  }
};

export const updatePassword = async (id, hashedPassword) => {
  try {
    const { error } = await supabase
      .from(TABLE)
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error in updatePassword:', error);
      throw new AppError(error.message, 500);
    }
  } catch (error) {
    console.error('Exception in updatePassword:', error);
    throw error;
  }
};