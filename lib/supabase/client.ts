import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const createClient = () => createSupabaseClient(supabaseUrl, supabaseKey);
