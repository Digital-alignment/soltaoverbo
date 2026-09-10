import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtdruienammtqodgfqty.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjYzNSwiZXhwIjoyMDc5MzI4NjM1fQ.dhRdq0jJLwq5pBl9K-Fkgh3WmEQwPwPSo_6Zzayl_8M';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function listTables() {
  const tables = [
    'users_profiles',
    'courses',
    'course_lessons',
    'course_materials',
    'writing_exercises',
    'community_posts',
    'comments',
    'post_likes',
    'banners',
    'admin_broadcasts',
    'notifications',
    'contact_messages',
    'checkout_attempts',
    'site_settings',
    'site_pages_content'
  ];

  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`❌ Table ${t}:`, error.message);
    } else {
      console.log(`✅ Table ${t}: exists (${data.length} records)`);
    }
  }
}

listTables();
