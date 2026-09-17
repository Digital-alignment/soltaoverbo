import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL || 'https://qtdruienammtqodgfqty.supabase.co';
const supabaseAnonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTI2MzUsImV4cCI6MjA3OTMyODYzNX0.-7ljaIopIzCKsjdIhhQY6RCih_jmhkv0ZzsreMq4jPw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
