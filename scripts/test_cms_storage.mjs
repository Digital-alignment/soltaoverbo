import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtdruienammtqodgfqty.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjYzNSwiZXhwIjoyMDc5MzI4NjM1fQ.dhRdq0jJLwq5pBl9K-Fkgh3WmEQwPwPSo_6Zzayl_8M';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testStorageCMS() {
  const initialContent = {
    landing: {
      hero_title: 'uma comunidade de escrita e escuta autoral',
      hero_subtitle: 'para mulheres e mentes criativas que buscam transformar sentimentos em palavras sem cobrança.',
      hero_image: '/hero_banner.jpg',
    },
    about: {
      hero_title: 'nossa história & movimento',
      hero_subtitle: 'o solta o verbo nasceu do desejo de criar espaços protegidos para a escrita autoral.',
      hero_image: '/about_hero.jpg',
    },
    programs: {
      title: 'nossas oficinas e rituais guiados',
      subtitle: 'experiências imersivas de escrita para desbloquear a sua voz.',
    }
  };

  const blob = new Blob([JSON.stringify(initialContent, null, 2)], { type: 'application/json' });
  const { data, error } = await supabase.storage
    .from('banners')
    .upload('cms_site_pages.json', blob, { upsert: true, contentType: 'application/json' });

  if (error) {
    console.error('❌ Error uploading cms_site_pages.json:', error.message);
  } else {
    console.log('✅ Uploaded cms_site_pages.json successfully:', data);
    
    const { data: publicUrlData } = supabase.storage.from('banners').getPublicUrl('cms_site_pages.json');
    console.log('🔗 Public URL:', publicUrlData.publicUrl);
  }
}

testStorageCMS();
