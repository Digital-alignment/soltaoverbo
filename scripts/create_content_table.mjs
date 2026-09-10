import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtdruienammtqodgfqty.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjYzNSwiZXhwIjoyMDc5MzI4NjM1fQ.dhRdq0jJLwq5pBl9K-Fkgh3WmEQwPwPSo_6Zzayl_8M';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTable() {
  // Let's test if there's an rpc or if we can insert into an existing table or create site_pages_content
  const { data, error } = await supabase.rpc('exec_sql', { sql: `
    CREATE TABLE IF NOT EXISTS public.site_pages_content (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page_slug TEXT NOT NULL,
      section_key TEXT NOT NULL,
      title TEXT,
      subtitle TEXT,
      body_text TEXT,
      image_url TEXT,
      button_text TEXT,
      button_link TEXT,
      extra_data JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      UNIQUE(page_slug, section_key)
    );
  ` });

  if (error) {
    console.log('RPC exec_sql error:', error.message);
  } else {
    console.log('Table site_pages_content created via RPC successfully!');
  }
}

createTable();
