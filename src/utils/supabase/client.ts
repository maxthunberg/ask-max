import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info.tsx';

export const createClient = () => {
  return createSupabaseClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );
};
