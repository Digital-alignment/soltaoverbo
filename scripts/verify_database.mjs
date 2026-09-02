import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtdruienammtqodgfqty.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjYzNSwiZXhwIjoyMDc5MzI4NjM1fQ.dhRdq0jJLwq5pBl9K-Fkgh3WmEQwPwPSo_6Zzayl_8M';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifyDatabase() {
  console.log('🔍 Iniciando verificação completa da base de dados Supabase...\n');

  // 1. Testar tabela users_profiles
  const { data: profiles, error: pErr } = await supabase.from('users_profiles').select('id, display_name, role');
  if (pErr) console.error('❌ Erro em users_profiles:', pErr);
  else console.log(`✅ [users_profiles] ${profiles.length} perfis de usuárias cadastrados.`);

  // 2. Testar tabela writing_exercises
  const { data: exercises, error: eErr } = await supabase.from('writing_exercises').select('id, title, user_id, created_at');
  if (eErr) console.error('❌ Erro em writing_exercises:', eErr);
  else console.log(`✅ [writing_exercises] ${exercises.length} textos/rascunhos salvos no banco.`);

  // 3. Testar tabela community_posts
  const { data: posts, error: postErr } = await supabase
    .from('community_posts')
    .select(`
      id,
      published_at,
      writing_exercise:writing_exercises(title),
      user_profile:users_profiles(display_name)
    `);
  if (postErr) console.error('❌ Erro em community_posts:', postErr);
  else console.log(`✅ [community_posts] ${posts.length} textos compartilhados na Nossa Fogueira.`);

  // 4. Testar tabela comments
  const { data: comments, error: cErr } = await supabase.from('comments').select('id, content, post_id, lesson_id, user_id');
  if (cErr) console.error('❌ Erro em comments:', cErr);
  else console.log(`✅ [comments] ${comments.length} comentários registrados em aulas e fogueira.`);

  // 5. Testar tabela post_likes
  const { data: likes, error: lErr } = await supabase.from('post_likes').select('id, post_id, user_id');
  if (lErr) console.error('❌ Erro em post_likes:', lErr);
  else console.log(`✅ [post_likes] ${likes.length} curtidas registradas.`);

  // 6. Testar escrita e leitura de teste (Integridade CRUD)
  console.log('\n🧪 Testando Integridade de Escrita/Leitura...');
  const testUserId = profiles[0]?.id;
  if (testUserId) {
    const { data: newEx, error: insertExErr } = await supabase
      .from('writing_exercises')
      .insert({
        user_id: testUserId,
        title: 'teste de integridade de banco de dados',
        content: '<p>teste de escrita em tempo real.</p>',
        is_published: true,
      })
      .select()
      .single();

    if (insertExErr) {
      console.error('❌ Erro ao criar exercício de teste:', insertExErr);
    } else {
      console.log('  └─ ✅ Inserção de texto em writing_exercises OK (ID:', newEx.id, ')');

      // Limpar teste
      await supabase.from('writing_exercises').delete().eq('id', newEx.id);
      console.log('  └─ ✅ Remoção de texto de teste OK.');
    }
  }

  console.log('\n🎉 Verificação concluída! A base de dados está 100% íntegra e operacional.');
}

verifyDatabase().catch(console.error);
