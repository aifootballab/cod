// ============================================
// SUPABASE CLIENT - Enterprise Configuration
// ============================================

import { createClient } from '@supabase/supabase-js';

// Fallback hardcoded per Vercel env vars issue
const FALLBACK_URL = 'https://abdwvtoitxddtjcpbwky.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZHd2dG9pdHhkZHRqY3Bid2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NTg0MDAsImV4cCI6MjAyMjQzNDQwMH0.XVJxBq_M8mvYhZyIYzL82kNqyJXIe0q8GI8YWG0s4IY';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Auth helpers
export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signInWithOAuth = async (provider: 'google' | 'discord') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const getUserAnalyses = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const getWeaponBuilds = async () => {
  const { data, error } = await supabase
    .from('weapon_builds')
    .select('*')
    .order('is_meta', { ascending: false });
  return { data, error };
};

// Upload screenshot
export const uploadScreenshot = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('screenshots')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  
  if (error) return { data: null, error };
  
  const { data: urlData } = supabase.storage
    .from('screenshots')
    .getPublicUrl(fileName);
  
  return { data: { path: fileName, url: urlData.publicUrl }, error: null };
};
